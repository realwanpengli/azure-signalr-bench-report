exports.sortMessageKeys = (keyList) => {
    return keyList.sort((a, b) => {
        const spA = a.split(":");
        const spB = b.split(":");
        if (spA.length < 3) return 1;
        if (spB.length < 3) return -1;
        if (spA[0] != "message") return 1;
        if (spB[0] != "message") return -1;
        if (spA[1] == "ge") return 1;
        if (spB[1] == "ge") return -1;
        return parseInt(spA[2], 10) - parseInt(spB[2], 10);
    });
}