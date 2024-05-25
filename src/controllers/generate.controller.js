import fs from 'fs-extra'
import Docker from 'dockerode'
import byline from 'byline'
import { 
  IMAGE_NAME,
  PROJECT_PATH,
  BUILD_PATH,
  TESTS_PATH,
  REPORT_PATH,
  FUNCTION_PATH,
  FUNCTION_TEST_PATH,
  SCRIPT_PATH 
} from '../config.js'

export const generate = async (req, res) => {
  try {
    await cleanProject()

    const code = req.body.code
    await fs.writeFile(FUNCTION_PATH, code)

    await generateTests()
    const test = await fs.readFile(FUNCTION_TEST_PATH)
    res.status(200).send(test)
  } catch (error) {
    console.error(error)
    res.status(500).send(error)
  }
}

const cleanProject = async () => {
  const pathsToRemove = [
    FUNCTION_PATH,
    BUILD_PATH,
    TESTS_PATH,
    REPORT_PATH
  ]

  for (const path of pathsToRemove) {
    await fs.remove(path)
  }
}

const generateTests = async () => {
  const docker = new Docker()
  const container = await docker.createContainer({
    Image: IMAGE_NAME,
    HostConfig: {
      Binds: [`${PROJECT_PATH}:${PROJECT_PATH}`]
    },
    Entrypoint: ['/bin/bash', '-c'],
    Cmd: [SCRIPT_PATH]
  })

  const stream = await container.attach({
    stream: true,
    stdout: true,
    stderr: true,
  })

  const out = byline(stream)
  out.on('data', (line) => {
    const newline = line.toString('utf8').trim()
    console.log(`container> ${newline}`)
  })

  await container.start()
  await container.wait()
  await container.remove()
}
