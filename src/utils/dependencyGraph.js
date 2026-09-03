/**
 * Given a disrupted component ID and the full list of components,
 * return an array of IDs that are downstream dependents (at risk).
 *
 * Uses recursive BFS through the `dependsOn` field.
 */
export function getAffectedComponents(disruptedId, components) {
  const affected = [];
  const visited = new Set();

  function traverse(id) {
    for (const comp of components) {
      if (
        comp.dependsOn &&
        comp.dependsOn.includes(id) &&
        !visited.has(comp.id)
      ) {
        visited.add(comp.id);
        affected.push(comp.id);
        traverse(comp.id);
      }
    }
  }

  traverse(disruptedId);
  return affected;
}
