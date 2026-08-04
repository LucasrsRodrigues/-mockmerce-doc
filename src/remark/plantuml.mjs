/**
 * Plugin remark para PlantUML — converte blocos ```plantuml (ou ```puml)
 * numa <img> apontando para o servidor público do PlantUML (encoding hex `~h`),
 * que dispensa a compressão deflate.
 *
 * Usa `unist-util-visit` e visita SOMENTE nós `code` — assim não encosta nos
 * nós de admonition/diretiva (`:::`) nem em nenhum outro conteúdo.
 */
import { visit } from 'unist-util-visit';

const PLANTUML_SERVER = 'https://www.plantuml.com/plantuml/svg';

export default function remarkPlantuml() {
  return (tree) => {
    visit(tree, 'code', (node, index, parent) => {
      if (!parent || index === null || index === undefined) return;
      if (node.lang !== 'plantuml' && node.lang !== 'puml') return;

      const source = String(node.value ?? '').trim();
      const hex = Buffer.from(source, 'utf8').toString('hex');
      const url = `${PLANTUML_SERVER}/~h${hex}`;
      const alt = (node.meta && node.meta.trim()) || 'Diagrama PlantUML';

      parent.children[index] = {
        type: 'paragraph',
        children: [{ type: 'image', url, alt, title: alt }],
      };
    });
  };
}
