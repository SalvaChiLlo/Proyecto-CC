export async function wait(seconds: number) {
  return new Promise(res => setTimeout(res, seconds * 1000))
}