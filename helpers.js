const millisecondsToHours = (ms) => {
    return (ms / 1000 / 60 / 60).toFixed(2);
}

module.exports = { millisecondsToHours };
