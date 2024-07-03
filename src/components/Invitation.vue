<template>
  <div class="wedding-invitation" :class="{ 'invitation-bounce': canOpen }">
    <div class="invitation-container" :class="{ 'invitation-down': isOpening }">
      <div class="invitation-cover">
        <div class="cover-content" :class="{ 'invitation-up': isOpening }">
          <div class="content-inside">
            <img class="content-inside-photo" src="../images/photo.jpg" />
            <p>📣 我们结婚啦！</p>
            <p><b>🤵🏻 王志红 & 👰🏻 潘俊贤</b></p>
            <p>🗓：2024年4月26日</p>
            <p>
              📍：安庆同庆楼-迎江区<a href="https://surl.amap.com/fQsbaQk1a17u">
                🧭:导航</a>
            </p>
            <div class="content-inside-bless">
              <input placeholder="兄台，留下尊姓大名" @keyup.enter="sendBarrage" @focus="isFocused = true"
                @blur="(isFocused = false), (hasEntered = false)" v-model="userName" ref="wishInput" />
              <input placeholder="写下你的祝福" @keyup.enter="sendBarrage" @focus="isFocused = true"
                @blur="(isFocused = false), (hasEntered = false)" v-model="wish" ref="wishInput" />
              <p v-if="!wish && isFocused && hasEntered">请输入祝福哦</p>
              <div>
                <button @click="sendBarrage">发送祝福弹幕</button>
                <button @click="closeInvitation">关闭</button>
              </div>
            </div>
          </div>
        </div>
        <div class="cover-inside-left" :class="{ opening: isOpening }"></div>
        <div class="cover-inside-right" :class="{ opening: isOpening }"></div>
        <img class="cover-inside-seal" src="../images/seal.png" @click="openInvitation"
          :class="{ 'invitation-flight': isOpening }" />
      </div>
    </div>
    <audio v-show="flase" :src="require('../assets/converter.mp3')" id="audio" loop="loop" controls="controls"
      preload="auto" autoplay="autoplay">
    </audio>
  </div>
</template>
<script>
import confetti from "canvas-confetti";
import AV from "leancloud-storage";
import backgroundMusic from "../assets/Music.mp3";
import backgroundMusicConverter from "../assets/converter.mp3";
export default {
  props: ["canOpen"],
  data() {
    return {
      isOpening: false,
      userName: "",
      wish: "",
      isFocused: false,
      hasEntered: false,
      location: "",
      isPlayMusic: true,
    };
  },
  created() {
    this.getLocation();
    this.audio();
  },
  methods: {
    audio() {
      document.addEventListener('DOMContentLoaded', function () {
        function audioAutoPlay() {
          var musicEle0 = document.getElementById('audio');
          musicEle0.play();
        }
        audioAutoPlay();
      })
    },
    // 打开邀请函
    openInvitation() {
      this.isOpening = true;
      this.playBackgroundMusic();
    },
    closeInvitation() {
      this.isOpening = false;
      setTimeout(() => {
        this.$emit("onClose");
      }, 660);
    },
    // 发送弹幕
    sendBarrage(e) {
      const wishMsgDate =
        "📬️ " + this.userName + ": " + this.wish + "      📍" + this.location;
      // 放烟花
      for (let index = 0; index < 4; index++) {
        setTimeout(() => {
          confetti({
            particleCount: 100, // 粒子数量
            spread: 90, // 粒子速度
            origin: {
              // 随机位置在容器范围内
              x: Math.random(),
              y: Math.random(),
            },
          });
        }, Math.random() * 700); // 随机延迟时间，单位为毫秒，这里设置最大延迟为 5 秒
      }
      this.$nextTick(() => {
        this.hasEntered = true;
        if (!this.wish || !this.userName) {
          return;
        }
        this.isOpening = false;
        this.$refs.wishInput.blur();
        setTimeout(() => {
          this.$emit("sendBarrage", wishMsgDate);
        }, 660);
        this.saveDate(wishMsgDate);
      });
    },
    getLocation() {
      // 获取ip地址
      fetch("https://api.ipify.org?format=json")
        .then((response) => response.json())
        .then((data) => {
          const ip = data.ip;
          //通过ip地址获取所在地
          fetch(`https://api.vore.top/api/IPdata?ip=${ip}`).then((res) =>
            res.json().then((data1) => {
              // console.log(data1);
              this.location = data1.ipdata.info1 + data1.ipdata.info2;
            })
          );
        });
      // .catch((error) => {
      //   console.error(error);
      // });
    },
    saveDate(wishMsgDate) {
      const Product = AV.Object.extend("zheeom_wishDate");
      const product = new Product();
      product.set("wishMsgDate", wishMsgDate);
      // 将对象保存到云端
      product.save();
    },
    playBackgroundMusic() {
      if (this.isPlayMusic) {
        const audio = new Audio(backgroundMusic);
        audio.loop = true;
        audio.play();
        this.isPlayMusic = false;
      }
    },
  },
};
</script>

<style lang="less">
.wedding-invitation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 30px 20px;
  padding-top: 60px;
  z-index: 4;
  transform: scale(0.05);
  -webkit-transform: scale(0.05);
  opacity: 0;
  transition: transform 0.8s cubic-bezier(0.26, 1.84, 0.39, 0.61),
    opacity 0.5s linear;
  -webkit-transition: -webkit-transform 0.8s cubic-bezier(0.26, 1.84, 0.39, 0.61),
    opacity 0.5s linear;
  background-size: 100%;
  overflow: hidden;

  &.invitation-bounce {
    opacity: 1;
    transform: scale(1);
    -webkit-transform: scale(1);
  }

  .invitation-container {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.6s cubic-bezier(0.4, 0, 1, 1);
    -webkit-transition: -webkit-transform 0.6s cubic-bezier(0.4, 0, 1, 1);

    &.invitation-down {
      transform: translateY(20px);
      -webkit-transform: translateY(20px);
    }

    .invitation-cover {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #d65047;
      border-radius: 10px;
      perspective: 500px;
      box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.15);

      .cover-content {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        padding: 10px 20px;
        transition: transform 0.6s cubic-bezier(0.4, 0, 1, 1);
        -webkit-transition: -webkit-transform 0.6s cubic-bezier(0.4, 0, 1, 1);

        &.invitation-up {
          transform: translateY(-60px);
          -webkit-transform: translateY(-60px);
        }

        .content-inside {
          height: 100%;
          padding: 20px;
          color: #a9895d;
          background-color: #fff1de;
          text-align: center;
          overflow: auto;

          .content-inside-photo {
            width: 100%;
            margin-bottom: 10px;
            padding: 5px;
            border: 1px solid #f7debb;
          }

          p {
            margin-top: 0;
            margin-bottom: 5px;
          }

          .content-inside-bless {
            input {
              width: 100%;
              height: 35px;
              margin-bottom: 10px;
              outline: none;
              border: none;
              border-bottom: 1px solid #f7debb;
              color: #a9895d;
              background: transparent;
              font-size: 16px;

              &::-webkit-input-placeholder {
                color: #e8d1b1;
                font-size: 12px;
              }

              &::-moz-placeholder {
                color: #e8d1b1;
                font-size: 12px;
              }

              &:-ms-input-placeholder {
                color: #e8d1b1;
                font-size: 12px;
              }

              &:-moz-placeholder {
                color: #e8d1b1;
                font-size: 12px;
              }
            }

            >div {
              display: flex;

              button {
                width: 100%;
                height: 35px;
                color: #a9895d;
                background: #f7debb;
                border: none;
                outline: none;

                &:disabled {
                  opacity: 0.8;
                }

                &:first-child {
                  margin-right: 10px;
                  flex: 1;
                }

                &:last-child {
                  width: 60px;
                  border: 1px solid #f7debb;
                  background: transparent;
                }
              }
            }
          }
        }
      }

      .cover-inside-left {
        position: absolute;
        left: 0;
        top: 0;
        width: 70%;
        height: 100%;
        border-radius: 10px;
        background-color: #d65047;
        box-shadow: 5px 0 10px rgba(0, 0, 0, 0.2);
        z-index: 6;
        transition: transform 0.5s;
        -webkit-transition: -webkit-transform 0.5s;
        transform-origin: 0 50%;
        -webkit-transform-origin: 0 50%;

        &.opening {
          transform: rotate3d(0, 1, 0, -140deg);
          -webkit-transform: rotate3d(0, 1, 0, -140deg);
        }
      }

      .cover-inside-right {
        position: absolute;
        right: 0;
        top: 0;
        width: 40%;
        height: 100%;
        border-radius: 10px;
        background-color: #d65047;
        box-shadow: -5px 0 10px rgba(0, 0, 0, 0.2);
        z-index: 5;
        transition: transform 0.5s;
        -webkit-transition: -webkit-transform 0.5s;
        transform-origin: 100% 50%;
        -webkit-transform-origin: 100% 50%;

        &.opening {
          transform: rotate3d(0, 1, 0, 140deg);
          -webkit-transform: rotate3d(0, 1, 0, 140deg);
        }
      }

      .cover-inside-seal {
        position: absolute;
        left: 70%;
        bottom: 100px;
        width: 80px;
        height: 80px;
        margin-left: -40px;
        z-index: 7;
        transform-origin: 50% 50%;
        -webkit-transform-origin: 50% 50%;
        transition: all 0.8s cubic-bezier(0.4, 0, 1, 1);
        -webkit-transition: all 0.8s cubic-bezier(0.4, 0, 1, 1);

        &.invitation-flight {
          opacity: 0;
        }
      }
    }
  }
}
</style>
