import express from 'express'
import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import { Database, Resource } from '@adminjs/prisma'
import { PrismaClient } from '@prisma/client'
import { DMMFClass } from '@prisma/client/runtime'

const PORT = 3000

const prisma = new PrismaClient()

AdminJS.registerAdapter({ Database, Resource })

const start = async () => {
  const app = express()

  const dmmf = ((prisma as any)._baseDmmf as DMMFClass)
  const adminOptions = {
    // We pass Publisher to `resources`
    resources: [{
      resource: { model: dmmf.modelMap.Instruments, client: prisma },
      options: {},
       }, {
      resource: { model: dmmf.modelMap.Brands, client: prisma },
      options: {},
    }],
  }

  const admin = new AdminJS(adminOptions)

  const adminRouter = AdminJSExpress.buildRouter(admin)
  app.use(admin.options.rootPath, adminRouter)

  app.listen(PORT, () => {
    console.log(`AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`)
  })
}

start()
