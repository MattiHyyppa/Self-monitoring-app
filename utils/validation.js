import { invalid, defaultMessages } from '../deps.js';

defaultMessages.isNotNaN = ':attr must not be NaN'
const isNotNaN = (value) => isNaN(value) ? invalid("isNotNaN", { value, message: `${value} is NaN` }) : undefined

export { isNotNaN };