function add(value1, value2) {
    var r1, r2, m;
    try {
        r1 = value1.toString().split(".")[1].length;
    } catch (e) {
        r1 = 0;
    }
    try {
        r2 = value2.toString().split(".")[1].length;
    } catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    return (value1 * m + value2 * m) / m;
}
function Subtr(value1, value2) {
    var r1, r2, m, n;
    try {
        r1 = value1.toString().split(".")[1].length;
    } catch (e) {
        r1 = 0;
    }
    try {
        r2 = value2.toString().split(".")[1].length;
    } catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    // 动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return ((value1 * m - value2 * m) / m).toFixed(n);
}
function multiple(value1, value2) {
    var m = 0, s1 = value1.toString(), s2 = value2.toString();
    try {
        m += s1.split(".")[1].length;
    } catch (e) {
    }
    try {
        m += s2.split(".")[1].length;
    } catch (e) {
    }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}
function divider(value1, value2) {
    var t1 = 0, t2 = 0, r1, r2;
    try {
        t1 = value1.toString().split(".")[1].length;
    } catch (e) {
    }
    try {
        t2 = value2.toString().split(".")[1].length;
    } catch (e) {
    }
    with (Math) {
        r1 = Number(value1.toString().replace(".", ""));
        r2 = Number(value2.toString().replace(".", ""));
        return (r1 / r2) * pow(10, t2 - t1);
    }
}
