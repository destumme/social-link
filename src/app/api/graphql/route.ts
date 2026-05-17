import { createServer } from 'node:http'
import { createSchema, createYoga } from 'graphql-yoga'
import {schema} from '@/lib/graphql'

const yoga = createYoga({schema})
const server = createServer(yoga)

