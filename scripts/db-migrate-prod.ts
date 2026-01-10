import { execSync } from 'node:child_process'

const command = process.argv[2] === 'status' ? 'status' : 'apply'
execSync(`atlas migrate ${command} --env production`, { stdio: 'inherit' })
