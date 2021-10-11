//from https://gist.github.com/gerhardberger/2268998#gistcomment-2334116

export function zipWith(λ, xs, ys) {
  if (xs.length == 0) return [];
  else return [λ(xs[0], ys[0])].concat(zipWith(λ, xs.slice(1), ys.slice(1)));
}

export function structuredClone(obj: unknown) {
  return JSON.parse(JSON.stringify(obj));
}
