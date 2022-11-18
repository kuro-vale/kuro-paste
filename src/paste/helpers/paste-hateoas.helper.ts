export function pasteHateoas(id: string): string {
  const host = process.env.HOST || 'localhost:3000';
  return `${host}/pastes/${id}`;
}
