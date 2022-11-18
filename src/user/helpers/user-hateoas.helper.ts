export function userHateoas(id: string): string {
  const host = process.env.HOST || 'localhost:3000';
  return `${host}/users/${id}/pastes`;
}
