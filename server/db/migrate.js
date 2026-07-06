import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { sql } from '../src/db.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const schema = readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8')

function splitStatements(sqlText) {
  const statements = []
  let current = ''
  let inDollarQuote = false

  for (let i = 0; i < sqlText.length; i += 1) {
    if (sqlText.slice(i, i + 2) === '$$') {
      inDollarQuote = !inDollarQuote
      current += '$$'
      i += 1
      continue
    }
    if (sqlText[i] === ';' && !inDollarQuote) {
      statements.push(current.trim())
      current = ''
      continue
    }
    current += sqlText[i]
  }
  if (current.trim()) statements.push(current.trim())

  return statements.filter(Boolean)
}

const statements = splitStatements(schema)

async function migrate() {
  for (const statement of statements) {
    await sql(statement)
  }
  console.log(`Migration complete: ran ${statements.length} statements.`)
}

migrate()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Migration failed:', err)
    process.exit(1)
  })
