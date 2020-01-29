function Decoder(bytes, f_port) {
    function swapBytes(buf) {
      var bytes = new Uint8Array(buf);
      var len = bytes.length;
      var holder;
      for (var i = 0; i<len; i+=4) {
        holder = bytes[i];
        bytes[i] = bytes[i+3];
        bytes[i+3] = holder;
        holder = bytes[i+1];
        bytes[i+1] = bytes[i+2];
        bytes[i+2] = holder;
      }
      return bytes;
    }
    function bytesToFloat(bytes, decimalPlaces) {
        var bits = (bytes[3] << 24) | (bytes[2] << 16) | (bytes[1] << 8) | bytes[0];
        var sign = (bits >>> 31 === 0) ? 1.0 : -1.0;
        var e = bits >>> 23 & 0xff;
        var m = (e === 0) ? (bits & 0x7fffff) << 1 : (bits & 0x7fffff) | 0x800000;
        var f = Math.round((sign * m * Math.pow(2, e - 150)) * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);
        return f;
    }

    function bytesToInt32(bytes, signed) {
        var bits = bytes[0] | (bytes[1] << 8) | (bytes[2] << 16) | (bytes[3] << 24);
        var sign = 1;

        if (signed && bits >>> 31 === 1) {
            sign = -1;
            bits = bits & 0x7FFFFFFF;
        }

        return bits * sign;
    }

    function bytesToShort(bytes, signed) {
        var bits = bytes[0] | (bytes[1] << 8);
        var sign = 1;

        if (signed && bits >>> 15 === 1) {
            sign = -1;
            bits = bits & 0x7FFF;
        }

        return bits * sign;
    }

//    var swapedBytes = swapBytes(bytes);
    var swapedBytes = bytes;
    
    return {
        "temperature": bytesToFloat(swapedBytes.slice(3, 7), 3),
        "humidity": bytesToFloat(swapedBytes.slice(11, 14), 3)
    };
}

var b = Buffer.from('AQEQnEoAAAECEHCUAAC8nA==', 'base64');
console.log(b)

console.log(Decoder(b, ''));