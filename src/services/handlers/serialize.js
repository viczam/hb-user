import { decorators } from 'octobus.js';

const { withHandler } = decorators;

const handler = ({ _id, username }) => ({ id: _id, username });

export default withHandler(handler);
