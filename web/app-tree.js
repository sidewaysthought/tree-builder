function renderTree(people) {
  const marginX = 40;
  const marginY = 40;
  const dx = 80;
  const dy = 160;
  const boxWidth = 140;
  const lineHeight = 14;

  function nodeHeight(d) {
    return d.data.maidenName ? lineHeight * 3 + 8 : lineHeight * 2 + 8;
  }

  function buildHierarchy(people) {
    const nodes = new Map();
    for (const p of people) {
      nodes.set(String(p.id), {
        id: String(p.id),
        firstNames: p.firstNames || '',
        lastNames: p.lastNames || '',
        maidenName: p.maidenName || '',
        birthDate: p.birthDate || '',
        deathDate: p.deathDate || '',
        partnerId: p.partnerId != null ? String(p.partnerId) : null,
        children: []
      });
    }
    const root = {
      id: 'world',
      firstNames: 'World',
      lastNames: '',
      maidenName: '',
      birthDate: '',
      deathDate: '',
      partnerId: null,
      children: []
    };
    nodes.set('world', root);
    for (const p of people) {
      const parentId =
        p.parent1Id != null
          ? String(p.parent1Id)
          : p.parent2Id != null
          ? String(p.parent2Id)
          : 'world';
      const parent = nodes.get(parentId) || root;
      parent.children.push(nodes.get(String(p.id)));
    }
    return d3.hierarchy(root);
  }

  const root = buildHierarchy(people);
  const treeLayout = d3.tree().nodeSize([dx, dy]);
  treeLayout(root);

  let minX = Infinity;
  let maxX = -Infinity;
  root.each(d => {
    if (d.x < minX) minX = d.x;
    if (d.x > maxX) maxX = d.x;
  });
  const width = maxX - minX + marginX * 2 + boxWidth;
  const height = (root.height + 1) * dy + marginY * 2;

  root.each(d => {
    d.x = d.x - minX + marginX + boxWidth / 2;
    d.y = d.y + marginY;
  });

  const svg = d3
    .select('#tree')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet');

  svg.selectAll('*').remove();

  const g = svg.append('g');

  g
    .append('g')
    .attr('fill', 'none')
    .attr('stroke', '#555')
    .selectAll('path')
    .data(root.links())
    .join('path')
    .attr('d', d3.linkVertical().x(d => d.x).y(d => d.y));

  const nodeById = new Map();
  root.descendants().forEach(n => nodeById.set(n.data.id, n));
  const partnerLines = [];
  root.descendants().forEach(n => {
    const partnerId = n.data.partnerId;
    if (partnerId && nodeById.has(partnerId)) {
      if (parseInt(n.data.id, 10) < parseInt(partnerId, 10)) {
        partnerLines.push({ source: n, target: nodeById.get(partnerId) });
      }
    }
  });
  g
    .append('g')
    .attr('stroke', '#1d4ed8')
    .selectAll('line')
    .data(partnerLines)
    .join('line')
    .attr('x1', d => d.source.x)
    .attr('y1', d => d.source.y)
    .attr('x2', d => d.target.x)
    .attr('y2', d => d.target.y);

  const nodes = g
    .append('g')
    .selectAll('g')
    .data(root.descendants())
    .join('g')
    .attr('class', 'person')
    .attr('transform', d => `translate(${d.x},${d.y})`);

  nodes
    .append('rect')
    .attr('x', -boxWidth / 2)
    .attr('y', d => -nodeHeight(d) / 2)
    .attr('width', boxWidth)
    .attr('height', d => nodeHeight(d))
    .attr('class', 'fill-white stroke-gray-400');

  nodes
    .append('text')
    .attr('x', -boxWidth / 2 + 4)
    .attr('y', d => -nodeHeight(d) / 2 + lineHeight)
    .text(d => `${d.data.firstNames} ${d.data.lastNames}`);

  nodes
    .filter(d => d.data.maidenName)
    .append('text')
    .attr('x', -boxWidth / 2 + 4)
    .attr('y', d => -nodeHeight(d) / 2 + lineHeight * 2)
    .text(d => d.data.maidenName);

  nodes
    .append('text')
    .attr('x', -boxWidth / 2 + 4)
    .attr('y', d => -nodeHeight(d) / 2 + lineHeight * (d.data.maidenName ? 3 : 2))
    .text(
      d =>
        `${(d.data.birthDate || '').slice(0, 4)} - ${(d.data.deathDate || '').slice(0, 4)}`
    );

  const zoom = d3
    .zoom()
    .scaleExtent([0.5, 2])
    .filter(event => event.type === 'wheel' || !event.target.closest('.person'))
    .on('zoom', event => {
      g.attr('transform', event.transform);
    });

  svg.call(zoom);
}
