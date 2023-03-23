const messages = {
  healthy: ['This coral reef is healthy', 'Move your hands to interact with it'],
  warming: ['The water is warming up', 'This may get dangerous'],
  warm: ['1.1°C above normal temprature can bleach coral', 'Symbiotic plants inside coral are leaving'],
  healing: ['Temperatures have dropped, the coral is returning', 'It takes around 10 years to repopulate'],
  dying: ['Without food from symbiotic plants, coral dies'],
  dead: ['The coral skeleton is left', 'Algae slowly takes over']
}
const MESSAGE_DISPLAY_TIME = 180 // 3 seconds at 
let fade = 0
let timer = 0
function displayMessage() {

}