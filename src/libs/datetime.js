const dbTimeForHuman=(str) =>{
  return str.replace('T', ' ').substring(0, 16);
}

export default dbTimeForHuman