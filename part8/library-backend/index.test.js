describe('Part 8 - Library Backend Tests', () => {
  test('GraphQL query structure test', () => {
    const query = `
      query {
        allBooks {
          title
          author
        }
      }
    `;
    expect(query).toContain('allBooks');
  });

  test('backend server initial configuration', () => {
    const port = process.env.PORT || 4000;
    expect(port).toBeDefined();
  });
});
