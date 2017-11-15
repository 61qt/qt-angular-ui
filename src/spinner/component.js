import Template from './index.pug';

export default function () {
  return {
    restrict    : 'EA',
    replace     : true,
    template    : Template,
  };
}
