import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
  title: 'Article content',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      title: 'Text',
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'Heading 1', value: 'h1' },
        { title: 'Heading 2', value: 'h2' },
        { title: 'Heading 3', value: 'h3' },
        { title: 'Heading 4', value: 'h4' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet list', value: 'bullet' },
        { title: 'Numbered list', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Bold', value: 'strong' },
          { title: 'Italic', value: 'em' },
          { title: 'Inline code', value: 'code' },
          { title: 'Underline', value: 'underline' },
        ],
        annotations: [
          {
            title: 'Link',
            name: 'link',
            type: 'object',
            fields: [
              defineField({
                title: 'URL',
                name: 'href',
                type: 'url',
                validation: Rule => Rule.required(),
              }),
              defineField({
                title: 'Open in new tab',
                name: 'blank',
                type: 'boolean',
                initialValue: true,
              }),
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alternative text', type: 'string' }),
        defineField({ name: 'caption', title: 'Caption', type: 'string' }),
      ],
    }),
    defineArrayMember({
      name: 'codeSnippet',
      title: 'Code block',
      type: 'object',
      fields: [
        defineField({
          name: 'language',
          title: 'Language',
          type: 'string',
          options: {
            list: [
              { title: 'Plain text', value: 'text' },
              { title: 'JavaScript', value: 'javascript' },
              { title: 'TypeScript', value: 'typescript' },
              { title: 'HTML', value: 'html' },
              { title: 'CSS / SCSS', value: 'css' },
              { title: 'Java', value: 'java' },
              { title: 'JSON', value: 'json' },
              { title: 'Bash', value: 'bash' },
              { title: 'SQL', value: 'sql' },
            ],
          },
          initialValue: 'typescript',
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: 'code',
          title: 'Code',
          type: 'text',
          rows: 10,
          validation: Rule => Rule.required(),
        }),
      ],
      preview: {
        select: { title: 'language', subtitle: 'code' },
        prepare({ title, subtitle }) {
          const firstLine = typeof subtitle === 'string' ? subtitle.split('\\n')[0] : '';
          return { title: `Code · ${title || 'text'}`, subtitle: firstLine };
        },
      },
    }),
    defineArrayMember({
      name: 'contentTable',
      title: 'Table',
      type: 'object',
      fields: [
        defineField({
          name: 'hasHeaderRow',
          title: 'First row is a header',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'rows',
          title: 'Rows',
          type: 'array',
          of: [
            defineArrayMember({
              name: 'tableRow',
              title: 'Row',
              type: 'object',
              fields: [
                defineField({
                  name: 'cells',
                  title: 'Cells (left to right)',
                  type: 'array',
                  of: [defineArrayMember({ type: 'string' })],
                  validation: Rule => Rule.required().min(1),
                }),
              ],
              preview: {
                select: { cells: 'cells' },
                prepare({ cells }) {
                  return { title: Array.isArray(cells) ? cells.join(' · ') : 'Table row' };
                },
              },
            }),
          ],
          validation: Rule => Rule.required().min(1),
        }),
      ],
      preview: {
        select: { rows: 'rows' },
        prepare({ rows }) {
          return { title: `Table (${Array.isArray(rows) ? rows.length : 0} rows)` };
        },
      },
    }),
  ],
})
