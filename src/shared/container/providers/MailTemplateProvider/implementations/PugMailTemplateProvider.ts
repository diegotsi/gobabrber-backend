import pug from 'pug'
import fs from 'fs'

import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO'
import IMailTemplateProvider from '../models/IMailTemplateProvider'

class PugMailTemplateProviders implements IMailTemplateProvider {
  public async parse({
    file,
    variables,
  }: IParseMailTemplateDTO): Promise<string> {
    const templateFileContent = await fs.promises.readFile(file, {
      encoding: 'utf-8',
    })
    const parseTemplate = pug.compile(templateFileContent)

    return parseTemplate(variables)
  }
}

export default PugMailTemplateProviders
