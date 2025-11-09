type isSell = {
  value?: boolean;
};

export function Loading({ value }: isSell) {
  return (
    <svg viewBox='25 25 50 50' className={`container ${value && 'sellLoader'}`}>
      <circle
        cx='50'
        cy='50'
        r='20'
        className='loader'
        style={{ stroke: value ? 'white' : '#106ee8' }}
      ></circle>
    </svg>
  );
}
