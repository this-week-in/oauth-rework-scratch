export default function getEnv(name) {
  return window?.configs?.[name]
}
