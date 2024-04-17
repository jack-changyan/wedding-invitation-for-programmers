<template>
  <div class="executions">
    <!--执行命令-->
    <p class="code" v-for="(execution, index) in executions" :key="index" v-show="execution.visible">
      <span class="addon">~</span>
      [<span class="time">{{ execution.time }}</span>]
      <span class="task">{{ execution.name }}</span>
      <span class="duration" v-if="execution.duration !== undefined">{{ execution.duration }} ms</span>
    </p>
    <!--进度条-->
    <p class="code" v-show="isProcessed">
      <span class="addon">~</span>
      {{ progressBarText }}
      <span class="percentage">{{ percentage }}%</span>
    </p>
    <!--执行命令-->
    <p class="code" v-show="endExecution.visible">
      <span class="addon">~</span>
      [<span class="time">{{ endExecution.time }}</span>]
      <span class="task">{{ endExecution.name }}</span>
    </p>
    <div>
      <audio v-show="flase" :src="require('../assets/compotr.mp3')" id="audioCompotr" loop="loop" controls="controls"
        preload="auto" autoplay="autoplay"></audio>
    </div>
  </div>
</template>

<script>
import data from "../mock/data";

export default {
  name: "Executions",
  props: ["canExecute"],
  data() {
    return {
      executions: data.executions,
      isProcessed: false,
      isFinished: false,
      progressBarText: "--------------------------",
      endExecution: {
        name: "打开中...",
        time: "",
        visible: false,
      },
    };
  },
  computed: {
    percentage() {
      const hashL = this.progressBarText
        .split("")
        .filter((c) => c === "#").length;
      const l = this.progressBarText.length;
      return Math.floor((hashL * 100) / l);
    },
  },
  watch: {
    canExecute: function (val) {
      if (val === true) {
        this.runExecutions();
      }
    },
  },
  created() {
    // this.audioCompotr();
  },
  updated() {
    this.$emit("onUpdating");
  },
  methods: {
    audioCompotr() {
      document.addEventListener("DOMContentLoaded", function () {
        function audioAutoPlay() {
          var audioCompotrMusic = document.getElementById("audioCompotr");
          audioCompotrMusic.play();
        }
        audioAutoPlay();
      });
    },
    // 逐条执行命令
    runExecutions: async function () {
      var musicEle0 = document.getElementById("audio");
      musicEle0.pause();
      var audioCompotrMusic = document.getElementById("audioCompotr");
      audioCompotrMusic.play();
      for (const execution of this.executions) {
        await this.progressivelyRun(execution);
      }
      // 执行完命令，开始显示进度条
      await this.successProcessing(1000);
      // 执行最后一条命令
      await this.progressivelyRun(this.endExecution).then(() => {
        setTimeout(() => {
          this.isFinished = true;
          this.$emit("onFinish");
        }, 500);
      });
      var audioCompotrMusic = document.getElementById("audioCompotr");
      audioCompotrMusic.pause();
    },
    // 执行一条命令
    progressivelyRun(execution, customDuration) {
      return new Promise((resolve) => {
        let now = new Date(),
          duration = customDuration ? customDuration : Math.random() * 50 + 250,
          showCode = () => {
            execution.time = now.toLocaleTimeString();
            execution.duration =
              execution.duration !== undefined
                ? duration.toFixed(2)
                : undefined;
            execution.visible = true;
            resolve();
          };
        setTimeout(showCode, duration);
      });
    },
    // 显示进度条
    successProcessing(duration) {
      return new Promise((resolve) => {
        let start = null,
          progressing,
          progressingCount = 0;
        this.isProcessed = true;
        let step = (timestamp) => {
          let timeGap;
          if (start === null) {
            start = timestamp;
          }
          timeGap = timestamp - start;
          if (progressingCount % 3 === 0) {
            this.progressBarText = this.progressBarText.replace("-", "#");
          }
          progressingCount++;
          if (timeGap < duration) {
            progressing = requestAnimationFrame(step);
          } else {
            resolve();
            this.progressBarText = this.progressBarText.replace(/-/g, "#");
            cancelAnimationFrame(progressing);
          }
        };
        progressing = requestAnimationFrame(step);
      });
    },
  },
};
</script>

<style lang="less">
.executions {
  .addon {
    color: #68fcfb;
  }

  .time {
    color: #666;
  }

  .task {
    color: #009ab2;
  }

  .duration {
    margin-left: 10px;
    color: #bf36b7;
  }
}
</style>