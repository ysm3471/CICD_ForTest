import { addNum, addNum2, checkNum, convertPhoneNumber } from "./index"
 
test("adds 1 + 2 to equal 3",() => {
  expect(addNum(1,2)).toBe(3)
})

test("adds 3 - 1 to equal 2",() => {
  expect(addNum2(3,1)).toBe(2)
})

test("remove except number",() => {
  expect(checkNum("12=34-252kfkdvlo3")).toBe("12342523")
})

it('convert string to phone number form',() => {
  expect(convertPhoneNumber('01012345678')).toBe('010-1234-5678') // 기본
  expect(convertPhoneNumber('0200055934')).toBe('02-0005-5934') // 서울 지역번호
  expect(convertPhoneNumber('0324239405')).toBe('032-423-9405') // 서울외 지역번호
  expect(convertPhoneNumber('0')).toBe('0') // 모든 형식보다 길이가 짧으면 인자 그대로 반환
})