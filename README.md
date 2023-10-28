# RXJS TODO

## 사용한 오퍼레이터
- filter
  - 우리가 흔히 알고있는 Array.prototype.filter와 사용방식은 유사하다.
  - filter 같은 경우에는 일종의 select 로써 사용이 가능하다.
  - filter가 true로 조건식이 부합한 데이터만 통과해서 값을 반환한다.
- map
  - 사용방법은 Array.prototype.map과 동일함
  - 보통 타입을 다른 타입으로써 변환할 많이 사용함
- withLatestFrom
 - 해당 오퍼레이터가 실행되는시점에 source observable의 마지막 데이터를 가져온다.
 - [event, data] 와 같은 식으로 치환됨
