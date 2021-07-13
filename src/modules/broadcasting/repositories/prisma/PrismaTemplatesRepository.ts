import { prisma } from '@infra/prisma/client'
import { TemplateMapper } from '@modules/broadcasting/mappers/TemplateMapper'

import { Template } from '../../domain/template/template'
import {
  ITemplatesRepository,
  TemplatesSearchParams,
} from '../ITemplatesRepository'

export class PrismaTemplatesRepository implements ITemplatesRepository {
  async findById(id: string): Promise<Template> {
    const template = await prisma.template.findUnique({ where: { id } })

    return TemplateMapper.toDomain(template)
  }

  async save(template: Template): Promise<void> {
    const data = TemplateMapper.toPersistence(template)

    await prisma.template.update({
      where: {
        id: template.id,
      },
      data,
    })
  }

  async create(template: Template): Promise<void> {
    const data = TemplateMapper.toPersistence(template)

    await prisma.template.create({ data })
  }

  async search({
    query,
    page,
    perPage,
  }: TemplatesSearchParams): Promise<Template[]> {
    const queryPayload = {
      take: perPage,
      skip: (page - 1) * perPage,
      where: {},
    }

    if (query) {
      queryPayload.where = {
        title: { contains: query },
      }
    }

    const templates = await prisma.template.findMany({
      ...queryPayload,
    })

    return templates.map(template => TemplateMapper.toDomain(template))
  }
}
