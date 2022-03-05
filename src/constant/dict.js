export function sex(value) {
  switch (value) {
    case 1: {
      return '男'
    }
    case 2: {
      return '女'
    }
    case 3:
    default: {
      return '未知'
    }
  }
}