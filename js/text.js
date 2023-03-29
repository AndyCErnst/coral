const HEALTHY = 0
const WARMING = 1
const WARM = 2
const HEALING = 3
const DYING = 4
const DEAD = 5
const RESTART = 6
const messages = {
  [HEALTHY]: [
    'This coral reef is healthy',
    'Move your hands to interact with it',
  ],
  [HEALING]: [
    'Temperatures are dropping, the coral is recovering',
    'It can take 10 years to regrow and repopulate',
  ],
  [WARMING]: ['The water is warming up', 'Unusually warm currents can damage coral'],
  [WARM]: [
    'Even 1.1°C above normal harms symbiotic algae inside coral',
    'When these algae leave, the coral bleachers',
  ],
  [DYING]: [
    'Without food from symbiotic plants, coral dies',
    'It leaves a shell-like skeleton behind',
  ],
  [DEAD]: [
    'Without coral, fish leave as well',
    'Turfing algae slowly takes over the reef',
  ],
  [RESTART]: ["There's almost no recovery from this", "Let's start over again"],
}
let deathTimer = 0

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
  push()
  setShadow()
  fill(255)
  text(message.text[pos], 480, 90 + 40 * pos)
  pop()
}

function fadeInMessage(message, pos) {
  push()
  setShadow(message.opacity)
  fill(255, 255, 255, message.opacity)
  text(message.text[pos], 480, 90 + 40 * pos)
  pop()
  if (message.opacity >= 255) {
    // done fading in, transition to next state
    message.state += 1
    message.opacity = 0
  } else {
    message.opacity += 3
  }
}

function fadeOutMessage(message) {
  push()
  setShadow(message.opacity)
  fill(255, 255, 255, message.opacity)
  text(message.text[0], 480, 90)
  text(message.text[1], 480, 90 + 40)
  pop()
  if (message.opacity <= 0) {
    // destroy self
    queue.shift()
  } else {
    message.opacity -= 4
  }
}
