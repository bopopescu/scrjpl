def i2cRead (addr, register, debug=False):
    """
    read value from a register at a given i2c address and return a byte
    input:
         addr : address on the i2c bus
         register : register number 
         debug : displaying debug messages if True (not used yet)
    output:
         v : register content
    """
    
    v = jogI2cRead(addr, register, debug)
    return v

def i2cWrite (addr, register, value, debug=False):
    """
    write a byte value in a register at a given i2c address, nothing returned
    input: 
         addr : address on the i2c bus
         register : register number 
         value : byte value to write in register
         debug : displaying debug messages if True (not used yet)
    """
    jogI2cWrite(addr, register, value, debug)

# ------------------------------------------------------------------
# i2c stuff 

# defining structure of i2C messages
class i2c_msg(ctypes.Structure):
    """<linux/i2c-dev.h> struct i2c_msg"""
    
    _fields_ = [
        ('addr', ctypes.c_uint16),
        ('flags', ctypes.c_ushort),
        ('len', ctypes.c_short),
        ('buf', ctypes.POINTER(ctypes.c_char))]

    __slots__ = [name for name,type in _fields_]

# i2c_msg flags
I2C_M_TEN		= 0x0010	# this is a ten bit chip address
I2C_M_WR		= 0x0000	# write data ????
I2C_M_RD		= 0x0001	# read data, from slave to master
I2C_M_NOSTART		= 0x4000	# if I2C_FUNC_PROTOCOL_MANGLING
I2C_M_REV_DIR_ADDR	= 0x2000	# if I2C_FUNC_PROTOCOL_MANGLING
I2C_M_IGNORE_NAK	= 0x1000	# if I2C_FUNC_PROTOCOL_MANGLING
I2C_M_NO_RD_ACK		= 0x0800	# if I2C_FUNC_PROTOCOL_MANGLING
I2C_M_RECV_LEN		= 0x1800	# length will be first received byte

# /usr/include/linux/i2c-dev.h: 155
class i2c_rdwr_ioctl_data(ctypes.Structure):
    """<linux/i2c-dev.h> struct i2c_rdwr_ioctl_data"""
    _fields_ = [
        ('msgs', ctypes.POINTER(i2c_msg)),
        ('nmsgs', ctypes.c_int)]

    __slots__ = [name for name,type in _fields_]

I2C_FUNC_I2C			= 0x00000001
I2C_FUNC_10BIT_ADDR		= 0x00000002
I2C_FUNC_PROTOCOL_MANGLING	= 0x00000004 # I2C_M_NOSTART etc.


# ioctls
I2C_SLAVE	= 0x0703	# Change slave address			
				# Attn.: Slave address is 7 or 10 bits  
I2C_SLAVE_FORCE	= 0x0706	# Change slave address			
				# Attn.: Slave address is 7 or 10 bits  
				# This changes the address, even if it  
				# is already taken!			
I2C_TENBIT	= 0x0704	# 0 for 7 bit addrs, != 0 for 10 bit	
I2C_FUNCS	= 0x0705	# Get the adapter functionality         
I2C_RDWR	= 0x0707	# Combined R/W transfer (one stop only) 

# translate msg to ioctl input
def i2c_ioctl_msg (*msgs):
    msg_count = len(msgs)                                                  
    msg_array = (i2c_msg*msg_count)(*msgs)
    return  msg_array,msg_count

# read value from a register at a given i2c address and return a byte
#    addr : address on the i2c bus
#    register : register number 
#    i2cDebug : displaying debug messages if true (not used yet)
def jogI2cRead (addr, register, debug):
    import fcntl
    import posix
    n_i2c = 0
    f_i2c = posix.open("/dev/i2c-%i"%(n_i2c), posix.O_RDWR)

    flags = I2C_M_WR
    buf = ctypes.create_string_buffer(1)
    buf[0] = chr(register)
    msgs = i2c_msg(addr=addr, flags=flags, len=ctypes.sizeof(buf), buf=buf)
    msg_array,msg_count = i2c_ioctl_msg(msgs)
    io_i2c = i2c_rdwr_ioctl_data (msgs=msg_array, nmsgs=msg_count) 
    i2c_stat = fcntl.ioctl(f_i2c, I2C_RDWR, io_i2c)

    msgs.flags = I2C_M_RD
    msg_array,msg_count = i2c_ioctl_msg(msgs)
    io_i2c = i2c_rdwr_ioctl_data (msgs=msg_array, nmsgs=msg_count) 
    i2c_stat = fcntl.ioctl(f_i2c, I2C_RDWR, io_i2c)

    posix.close (f_i2c)
    return ord(buf[0])


#  write a byte value in a register at a given i2c address, nothing returned
#    addr : address on the i2c bus
#    register : register number
#    value : byte value to write  
#    debug : displaying debug messages if true (not used yet)
def jogI2cWrite (addr, register, value, debug):
    import fcntl
    import posix
    n_i2c = 0
    f_i2c = posix.open("/dev/i2c-%i"%(n_i2c), posix.O_RDWR)

    flags = I2C_M_WR
    buf = ctypes.create_string_buffer(2)
    buf[0] = chr(register)
    buf[1] = chr(value)
    msgs = i2c_msg(addr=addr, flags=flags, len=ctypes.sizeof(buf), buf=buf)
    msg_array,msg_count = i2c_ioctl_msg(msgs)
    io_i2c = i2c_rdwr_ioctl_data (msgs=msg_array, nmsgs=msg_count) 
    i2c_stat = fcntl.ioctl(f_i2c, I2C_RDWR, io_i2c)

    posix.close (f_i2c)

# accessing I2C bus for VJOG
