export const isInIframe = () => {
  try {
    return window.self !== window.top
  } catch (error) {
    return true
  }
}
