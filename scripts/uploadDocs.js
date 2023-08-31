import { join, resolve, sep } from 'node:path'
import { readdir, stat } from 'node:fs/promises'
import { createReadStream, statSync } from 'node:fs'
import COS from 'cos-nodejs-sdk-v5'

const [secretId, secretKey, docket, region, distPath] = process.argv.slice(2)
const doscDistPath = resolve(process.cwd(), distPath ?? './docs/.vitepress/dist')
const cosDucket = {
  Bucket: docket,
  Region: region,
}

if ((!secretId || !secretKey || !docket || !region))
  throw new Error('secretId | secretKey | region | docket 不存在');

(async function () {
  const cos = new COS({
    SecretId: secretId,
    SecretKey: secretKey,
  })

  // 清空存储桶
  const cosDucketinfo = await getDucket(cos, cosDucket)
  await clearDucket(cos, cosDucketinfo)

  // 重新上传
  const files = await traverseDirectory(doscDistPath)
  const uploadMate = files.map((file) => {
    return {
      path: file,
      key: organizePath(file, doscDistPath),
    }
  })

  await Promise.all(uploadMate.map(info => upload(cos, info)))
})()

/**
 *
 * @param {*} cos
 * @param {*} info
 * @returns
    Key: 'nodedebug-2.png',
    LastModified: '2022-10-11T03:14:53.000Z',
    ETag: '"554a8f46981b7a89a3731ec8055720a4"',
    Size: '20382',
    Owner: { ID: '1301735126', DisplayName: '1301735126' },
    StorageClass: 'STANDARD'}
 */
async function getDucket(cos, info) {
  return new Promise((res, rej) => {
    cos.getBucket(info, (err, data) => {
      if (err)
        rej(err)
      else
        res(data.Contents)
    })
  })
}

// 清除 文件
async function clearDucket(cos, files) {
  return new Promise((res, rej) => {
    const objects = files.map((item) => {
      return { Key: item.Key }
    })
    cos.deleteMultipleObject(
      {
        ...cosDucket,
        Objects: objects,
      },
      (delError, deleteResult) => {
        if (delError)
          rej(delError)
        else
          res(deleteResult)
      },
    )
  })
}

async function upload(cos, { path, key }) {
  return new Promise((res, rej) => {
    cos.putObject(
      {
        ...cosDucket,
        Key: key,
        StorageClass: 'STANDARD',
        /* 当Body为stream类型时，ContentLength必传，否则onProgress不能返回正确的进度信息 */
        Body: createReadStream(path), // 上传文件对象
        ContentLength: statSync(path).size,
      },
      (err, data) => {
        if (err)
          rej(err)
        else
          res(data)
      },
    )
  })
}

async function traverseDirectory(path) {
  const staticFile = []

  async function readdirFile(p) {
    const files = await readdir(p)
    try {
      for await (const file of files) {
        const filePath = join(p, file)
        const sta = await stat(filePath)
        if (sta.isDirectory())
          await readdirFile(filePath)
        else
          staticFile.push(filePath)
      }
    }
    catch (err) {
      console.error(err)
    }
  }

  await readdirFile(path)

  return staticFile
}

function organizePath(path, clear = doscDistPath) {
  return path.replace(clear + sep, '').replace(sep, '/')
}
