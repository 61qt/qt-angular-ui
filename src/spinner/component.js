import Template from './index.jade';

export default function () {
  return {
    restrict    : 'EA',
    replace     : true,
    template    : Template,
  };
}
