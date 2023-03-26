const messages = {
  healthy: [
    'This coral reef is healthy',
    'Move your hands to interact with it',
  ],
  warming: ['The water is warming up', 'This may get dangerous'],
  warm: [
    '1.1°C above normal temprature can bleach coral',
    'Symbiotic plants inside coral are leaving',
  ],
  healing: [
    'Temperatures have dropped, the coral is returning',
    'It takes around 10 years to repopulate',
  ],
  dying: [
    'Without food from symbiotic plants, coral dies',
    'It leaves a "skeleton" behind',
  ],
  dead: ['The coral skeleton is left', 'Algae slowly takes over'],
}

const MESSAGE_DISPLAY_TIME = 180 // 3 seconds at least

const queue = []

function Message(type) {
  return {
    opacity: 0,
    // 0 means not shown
    // 1 means first shown
    // 2 means both shown
    // 3 fading out
    state: 0,
    text: messages[type].slice(),
    type,
  }
}

function addMessage(type) {
  // message already showing, or queued
  if (queue.find((m) => m.type === type)) {
    return
  }
  // remove unshown message so we can replace it
  if (queue.length === 2) {
    queue.pop()
  }
  // add new message
  queue.push(new Message(type))
}

function displayMessages() {
  if (!queue.length) {
    return
  }
  textAlign(CENTER)
  const [first, second] = queue
  switch (first.state) {
    case 0:
      fadeInMessage(first, 0)
      break
    case 1:
      displayPersistentMessage(first, 0)
      fadeInMessage(first, 1)
      break
    case 2:
      displayPersistentMessage(first, 0)
      displayPersistentMessage(first, 1)
      // first message is fully displayed, but another is queued
      // start fading out
      if (second) {
        first.opacity = 255
        first.state = 3
      }
      break
    case 3:
      fadeOutMessage(first)
      break
    default:
      print("this shouldn't happen")
  }
}

function displayPersistentMessage(message, pos) {
  fill(255)
  text(message.text[pos], 480, 90 + 40 * pos)
}

function fadeInMessage(message, pos) {
  fill(255, 255, 255, message.opacity)
  text(message.text[pos], 480, 90 + 40 * pos)

  if (message.opacity >= 255) {
    // done fading in, transition to next state
    message.state += 1
    message.opacity = 0
  } else {
    message.opacity += 6
  }
}

function fadeOutMessage(message) {
  fill(255, 255, 255, message.opacity)
  text(message.text[0], 480, 90)
  text(message.text[1], 480, 90 + 40)
  if (message.opacity <= 0) {
    // destroy self
    queue.shift()
  } else {
    message.opacity -= 6
  }
}
