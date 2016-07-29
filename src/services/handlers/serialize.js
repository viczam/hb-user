import { decorators } from 'octobus.js';
const { withHandler } = decorators;

const handler = ({ id, username }) => ({ id, username });

export default withHandler(handler);
