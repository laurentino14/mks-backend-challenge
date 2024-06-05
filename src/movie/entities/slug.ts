import { randomUUID } from 'crypto'

export class Slug {
  private value: string | null = null
  constructor(slug?: string) {
    if (slug) {
      this.value = slug
    }
  }

  generate(title: string) {
    const uuid = randomUUID()
    const hash = uuid.split('-')[0]
    const tempSlug =
      String(title).toLowerCase().replaceAll(' ', '-') + '-' + hash
    this.value = tempSlug
  }

  getValue(): string {
    return this.value
  }
}