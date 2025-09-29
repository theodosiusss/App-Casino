import { helper } from '@ember/component/helper';

export default helper(function isImage([value]: [string]) {
  return /\.(jpg|jpeg|png|gif|svg)$/.test(value);
});
