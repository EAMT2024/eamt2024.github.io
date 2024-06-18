import './math.js'
import './collapse.js'
import './session-badge.js'

import { Tooltip } from 'bootstrap'

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new Tooltip(tooltipTriggerEl))