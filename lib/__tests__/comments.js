const comments = require('../comments')

it('parses description and annotations', () => {
  expect(comments(`
    /**
     * Hello
     * @world
     */
  `)).toMatchSnapshot()
})

it('parses description and annotations (multi)', () => {
  expect(comments(`
    /**
     * This is a multi-line
     * description
     * @a hello
     * @b world
     */
  `)).toMatchSnapshot()
})

it('ignores annotations inside a code fence', () => {
  expect(comments(`
    /**
     * This comment contains a code fence
     * \`\`\`scss
     * @media () {}
     * \`\`\`
     * @a
     * @b
     */
  `)).toMatchSnapshot()
})
