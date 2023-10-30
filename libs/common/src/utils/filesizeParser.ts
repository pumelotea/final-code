const validAmount = function (n: any) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

const parsableUnit = function (u: any) {
  return u.match(/\D*/).pop() === u;
};

const incrementBases: any = {
  2: [
    [['b', 'bit', 'bits'], 1 / 8],
    [['B', 'Byte', 'Bytes', 'bytes'], 1],
    [['Kb'], 128],
    [['k', 'K', 'kb', 'KB', 'KiB', 'Ki', 'ki'], 1024],
    [['Mb'], 131072],
    [['m', 'M', 'mb', 'MB', 'MiB', 'Mi', 'mi'], Math.pow(1024, 2)],
    [['Gb'], 1.342e8],
    [['g', 'G', 'gb', 'GB', 'GiB', 'Gi', 'gi'], Math.pow(1024, 3)],
    [['Tb'], 1.374e11],
    [['t', 'T', 'tb', 'TB', 'TiB', 'Ti', 'ti'], Math.pow(1024, 4)],
    [['Pb'], 1.407e14],
    [['p', 'P', 'pb', 'PB', 'PiB', 'Pi', 'pi'], Math.pow(1024, 5)],
    [['Eb'], 1.441e17],
    [['e', 'E', 'eb', 'EB', 'EiB', 'Ei', 'ei'], Math.pow(1024, 6)],
  ],
  10: [
    [['b', 'bit', 'bits'], 1 / 8],
    [['B', 'Byte', 'Bytes', 'bytes'], 1],
    [['Kb'], 125],
    [['k', 'K', 'kb', 'KB', 'KiB', 'Ki', 'ki'], 1000],
    [['Mb'], 125000],
    [['m', 'M', 'mb', 'MB', 'MiB', 'Mi', 'mi'], 1.0e6],
    [['Gb'], 1.25e8],
    [['g', 'G', 'gb', 'GB', 'GiB', 'Gi', 'gi'], 1.0e9],
    [['Tb'], 1.25e11],
    [['t', 'T', 'tb', 'TB', 'TiB', 'Ti', 'ti'], 1.0e12],
    [['Pb'], 1.25e14],
    [['p', 'P', 'pb', 'PB', 'PiB', 'Pi', 'pi'], 1.0e15],
    [['Eb'], 1.25e17],
    [['e', 'E', 'eb', 'EB', 'EiB', 'Ei', 'ei'], 1.0e18],
  ],
};

export default function (input: any) {
  // eslint-disable-next-line prefer-rest-params
  const options = arguments[1] || {};
  const base = parseInt(options.base || 2);

  const parsed = input.toString().match(/^([0-9\.,]*)(?:\s*)?(.*)$/);
  const amount = parsed[1].replace(',', '.');
  const unit = parsed[2];

  const validUnit = function (sourceUnit: string) {
    return sourceUnit === unit;
  };

  if (!validAmount(amount) || !parsableUnit(unit)) {
    throw `Can't interpret ${input || 'a blank string'}`;
  }
  if (unit === '') return Math.round(Number(amount));

  const increments = incrementBases[base];
  for (let i = 0; i < increments.length; i++) {
    const _increment = increments[i];

    if (_increment[0].some(validUnit)) {
      return Math.round(amount * _increment[1]);
    }
  }

  throw `${unit} doesn't appear to be a valid unit`;
}
