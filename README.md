# CI/CD 테스트

#### Github Actions를 활용하여 버전 release시에 NPM 배포까지 자동으로 실행되도록 구성하였습니다. 
#### action을 실행할 때 원하는 버전을 입력하여 release 할 수 있습니다.

##### 사용 기술 : Node js, Typescript, Github Actions
##### 테스트 툴 : Jest
<br/>

> 주요 코드 1 - 유틸함수 구성

> 정규식을 활용하여 입력 값을 숫자만 받게하는 함수와 전화번호를 입력하면 '-'를 사용한 전화번호 양식으로 바꿔주는 함수입니다.

```js
const convertPhoneNumber = (number: string) => {
    let result = '';
    if (number.length === 11) {
        result = number.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    } else {
        if (number.length === 10 && number.indexOf('02') === 0) {
            result = number.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
        } else {
            result = number.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
        }
    }
    return result !== "" ? result : number;
};

function checkNum(val: string) {
    const regex = /[^0-9]/g;
    const result = val.replace(regex, "");
    return result
}
```
전화번호를 입력하는 칸은 회원가입, 내 정보 수정 및 입력 등 다양한 곳에서 사용되기 때문에 재사용성이 높아 패키지화하였습니다. <br>
또한 해당 Input에 type='tel'을 사용하는 경우가 많기 때문에 number type만 입력되는 함수도 만들어 배포하였습니다. <br><br>

> 주요 코드 2 - Testing 코드 구성

> Jest를 사용하여 Test를 진행하였습니다. Jest 버전은 30.0.5를 사용하였습니다.

```js
test("remove except number",() => {
  expect(checkNum("12=34-252kfkdvlo3")).toBe("12342523")
})

it('convert string to phone number form',() => {
  expect(convertPhoneNumber('01012345678')).toBe('010-1234-5678') // 기본
  expect(convertPhoneNumber('0200055934')).toBe('02-0005-5934') // 서울 지역번호
  expect(convertPhoneNumber('0324239405')).toBe('032-423-9405') // 서울외 지역번호
  expect(convertPhoneNumber('0')).toBe('0') // 모든 형식보다 길이가 짧으면 인자 그대로 반환
})
```
간단한 실행 확인용 코드와 함수 두 개의 Testing 코드를 작성하여 테스트를 진행하였습니다.

<img width="1239" height="270" alt="utill1" src="https://github.com/user-attachments/assets/4a03359d-c293-4961-b84c-95bb02242257" /><br><br>

> 주요 코드 3 - github workflows 구성

> ci/cd 구성을 위하여 github actions를 활용하였습니다. 빌드된 작업물은 NPM으로 자동 배포되게끔 구성하였습니다.

```bash
# release를 담당하는 workflow
name: Version & Release

on:
  workflow_dispatch:
    inputs:
      version:
        description: 'Release version (ex. 1.5.0)'
        required: true
  
permissions:
  contents: write 

jobs:
  bump-and-release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm test
      - run: git config user.name "github-actions[bot]"
      - run: git config user.email "github-actions[bot]@users.noreply.github.com"
      - run: |
          if [ -z "${{ github.event.inputs.version }}" ]; then
            npm version patch
          else
            npm version ${{ github.event.inputs.version }}
          fi
      - run: git push --follow-tags
      - run: gh release create v$(node -p "require('./package.json').version") --generate-notes
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
```bash
# NPM 배포를 담당하는 workflow
name: Node.js Package

on: 
  workflow_run:
    workflows: [Version & Release]
    types:
      - completed

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm test
      - run: npm run build

  publish-npm:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: https://registry.npmjs.org/
      - run: npm ci
      - run: npm run build
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{secrets.npm_token}}
```
순서는 다음과 같습니다. <br>
1. 작업자가 수정물을 PR 요청
2. 담당자가 확인 후 merge를 진행하고 버전 태그를 확인 후 workflow 실행. 태그 버전의 기본값은 patch이며 임의로 변경 가능합니다.
3. 테스트가 문제없이 진행된다면 태그에 새로운 버전 release 후 NPM에 배포까지 자동으로 진행합니다.<br><br>

### 작업 후기
직접 ci/cd 구성을 해보고 Jest를 활용하여 Testing과 NPM 배포까지 진행해봤습니다.<br>
ci/cd 코드를 작성할 때는 github copilot의 도움을 받았고 필요한 정보를 빠르게 얻을 수 있다는 점은 매우 좋았습니다.<br>
하지만 오류를 분석할 때는 정확한 정보를 제공하지 않는 경우가 많아 공식문서 및 구글링을 같이 활용하여 문제를 해결하였습니다.<br>
AI 도구는 시간단축에 많은 도움이 되지만 결국 개발자의 정확한 판단력과 경험이 가장 중요한 무기라는 것을 배울 수 있었습니다.









