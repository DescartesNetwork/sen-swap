import { Web3Storage } from 'web3.storage'

import { DataLoader } from '@sentre/senhub'

const KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDIxNDNmRDMwMDU0MmUyMDA4ZEVCNUI5OTAzOTgyREQ4QmUxMGYxMzMiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTY1NjQ2MjI0ODYsIm5hbWUiOiJzZW4tc3dhcCJ9.l3hgMMpDuFMaDcDukoCB6NJ5b-9p0_nZnfbwnp3izG4'

class IPFS {
  private provider: Web3Storage
  constructor() {
    this.provider = new Web3Storage({
      token: KEY,
      endpoint: new URL('https://api.web3.storage'),
    })
  }

  set = async (data: object) => {
    const file = new File([JSON.stringify(data)], 'file', {
      type: 'application/json',
    })
    const cid = await this.provider.put([file])
    return cid
  }

  get = async <T>(cid: string): Promise<T> => {
    return DataLoader.load<T>(`ipfs^${cid}`, async () => {
      const re = await this.provider.get(cid)
      const file = ((await re?.files()) || [])[0]
      const reader = new FileReader()
      return new Promise((resolve, reject) => {
        try {
          if (!file) throw new Error('Cannot read empty file')
          reader.onload = () => {
            const contents = reader.result?.toString()
            if (!contents) throw new Error('Cannot read empty file')
            return resolve(JSON.parse(contents))
          }
          reader.readAsText(file)
        } catch (er: any) {
          return reject(er.message)
        }
      })
    })
  }
}

export default IPFS
