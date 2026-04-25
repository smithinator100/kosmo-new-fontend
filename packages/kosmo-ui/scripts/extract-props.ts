/**
 * Static prop-table extractor.
 *
 * Walks every `components/<name>/types.ts` file, finds the `<Name>Props`
 * interface, and emits a typed JSON descriptor with name, type signature,
 * optional flag, default (extracted from JSDoc `@default`), and the JSDoc
 * description for each property.
 *
 * Output: `apps/prototype/src/generated/prop-tables.json`
 *
 * Run with: `npm run docs:extract` (from repo root or this package).
 */

import { readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as ts from 'typescript';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const REPO_ROOT = resolve(ROOT, '..', '..');
const COMPONENTS_DIR = resolve(ROOT, 'src', 'components');
const OUTPUT = resolve(REPO_ROOT, 'apps', 'prototype', 'src', 'generated', 'prop-tables.json');

interface PropDescriptor {
  name: string;
  type: string;
  optional: boolean;
  default?: string;
  description?: string;
}

interface ComponentDescriptor {
  name: string;
  displayName: string;
  props: PropDescriptor[];
}

function getJsDocText(symbol: ts.Symbol | undefined, checker: ts.TypeChecker): string | undefined {
  if (!symbol) return undefined;
  const display = ts.displayPartsToString(symbol.getDocumentationComment(checker));
  return display.length > 0 ? display : undefined;
}

function getJsDocTagValue(symbol: ts.Symbol | undefined, tagName: string): string | undefined {
  if (!symbol) return undefined;
  const tag = symbol.getJsDocTags().find((t) => t.name === tagName);
  if (!tag) return undefined;
  return ts.displayPartsToString(tag.text);
}

function describeProp(prop: ts.Symbol, node: ts.PropertySignature, checker: ts.TypeChecker): PropDescriptor {
  const optional = !!(node.questionToken);
  const typeNode = node.type;
  const type = typeNode ? typeNode.getText().replace(/\s+/g, ' ').trim() : 'unknown';

  return {
    name: prop.getName(),
    type,
    optional,
    default: getJsDocTagValue(prop, 'default'),
    description: getJsDocText(prop, checker),
  };
}

function extractInterface(
  source: ts.SourceFile,
  checker: ts.TypeChecker,
  interfaceName: string,
): PropDescriptor[] | null {
  let result: PropDescriptor[] | null = null;
  ts.forEachChild(source, (node) => {
    if (!ts.isInterfaceDeclaration(node)) return;
    if (node.name.text !== interfaceName) return;

    const props: PropDescriptor[] = [];
    for (const member of node.members) {
      if (!ts.isPropertySignature(member) || !member.name) continue;
      const symbol = checker.getSymbolAtLocation(member.name);
      if (!symbol) continue;
      props.push(describeProp(symbol, member, checker));
    }
    result = props;
  });
  return result;
}

function pascalCase(name: string): string {
  return name
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('');
}

function findComponentDirs(): string[] {
  return readdirSync(COMPONENTS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function buildProgram(filePaths: string[]): ts.Program {
  const tsconfigPath = ts.findConfigFile(ROOT, ts.sys.fileExists, 'tsconfig.json');
  if (!tsconfigPath) throw new Error('Could not find tsconfig.json');
  const tsconfig = ts.readConfigFile(tsconfigPath, ts.sys.readFile);
  const parsed = ts.parseJsonConfigFileContent(tsconfig.config, ts.sys, ROOT);
  return ts.createProgram({
    rootNames: filePaths,
    options: { ...parsed.options, noEmit: true },
  });
}

function main(): void {
  const dirs = findComponentDirs();
  const typesFiles = dirs.map((d) => join(COMPONENTS_DIR, d, 'types.ts'));
  const program = buildProgram(typesFiles);
  const checker = program.getTypeChecker();

  const components: ComponentDescriptor[] = [];

  for (const dir of dirs) {
    const file = join(COMPONENTS_DIR, dir, 'types.ts');
    const source = program.getSourceFile(file);
    if (!source) {
      console.warn(`[extract-props] missing source for ${dir}`);
      continue;
    }
    const displayName = pascalCase(dir);
    const propsInterface = `${displayName}Props`;
    const props = extractInterface(source, checker, propsInterface);
    if (!props) {
      console.warn(`[extract-props] no ${propsInterface} interface in ${file}`);
      continue;
    }
    components.push({ name: dir, displayName, props });
  }

  mkdirSync(dirname(OUTPUT), { recursive: true });
  writeFileSync(OUTPUT, JSON.stringify(components, null, 2) + '\n');
  console.log(`[extract-props] wrote ${components.length} components → ${OUTPUT}`);
}

main();
