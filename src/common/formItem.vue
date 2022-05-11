<template>
  <div>
    <el-form-item v-if="item.type === 'textarea'" label-width="0">
      <div style="padding-left: 20px">
        <div class="el-form-item__label">{{ item.label + '：' }}</div>
        <el-input
          type="textarea"
          v-model="item.val"
          :rows="4"
          :placeholder="item.placeholder"
        ></el-input>
        <div v-if="item.tips" class="tips">{{ item.tips }}</div>
      </div>
    </el-form-item>
    <template v-else-if="item.type === 'input-array'">
      <el-form-item
        v-for="(_, idx) in item.val"
        class="small input-array"
        :label="`${item.label}${idx + 1}：`"
        :key="`${item.attr}${idx}`"
      >
        <el-input v-model="item.val[idx]" :maxlength="12"></el-input>
        <i
          v-if="item.val.length - 1 === idx && (!item.max || item.max > item.val.length)"
          class="el-icon el-icon-circle-plus"
          @click="item.val.push('')"
        ></i>
        <i v-else class="el-icon el-icon-remove" @click="item.val.splice(idx, 1)"></i>
      </el-form-item>
      <div v-if="item.tips" class="tips">{{ item.tips }}</div>
    </template>
    <el-form-item v-else class="small" :label="item.label + '：'">
      <el-input
        v-if="item.type === 'base-text'"
        v-model="item.val"
        :maxlength="item.maxLength || 128"
        :placeholder="item.placeholder ? item.placeholder : item.isNecessary ? '必填' : '非必填'"
        @blur="item.rules ? inputBlur(item.rules, item) : null"
      />

      <template v-if="item.type === 'color-picker'">
        <el-color-picker v-model="item.val"></el-color-picker>
      </template>

      <template v-if="item.type === 'font'">
        <div
          :class="['font-set', item.val[0] === '600' ? 'checked' : '']"
          @click="setFont(item, item.attr[0])"
        >
          <i class="fa fa-bold"></i>
        </div>
        <div
          :class="['font-set', item.val[1] === 'underline' ? 'checked' : '']"
          @click="setFont(item, item.attr[1])"
        >
          <i class="fa fa-underline"></i>
        </div>
        <div
          :class="['font-set', item.val[2] === 'italic' ? 'checked' : '']"
          @click="setFont(item, item.attr[2])"
        >
          <i class="fa fa-italic"></i>
        </div>
        <div
          :class="['font-set', item.val[3] === 'left' ? 'checked' : '']"
          @click="setAlign(item, 'left')"
        >
          <i class="fa fa-align-left"></i>
        </div>
        <div
          :class="['font-set', item.val[3] === 'center' ? 'checked' : '']"
          @click="setAlign(item, 'center')"
        >
          <i class="fa fa-align-center"></i>
        </div>
        <div
          :class="['font-set', item.val[3] === 'right' ? 'checked' : '']"
          @click="setAlign(item, 'right')"
        >
          <i class="fa fa-align-right"></i>
        </div>
      </template>

      <template v-if="item.type === 'input-number'">
        <el-input-number v-model="item.val" :min="item.min" :max="item.max" :step="item.step">
        </el-input-number>
      </template>

      <template v-if="item.type === 'select'">
        <el-select v-model="item.val" placeholder="默认选项">
          <el-option v-for="opt in item.options" :label="opt.name" :value="opt.val"> </el-option>
        </el-select>
      </template>

      <template v-if="item.type === 'radio'">
        <div>
          <template v-for="opt in item.options">
            <el-radio v-model="item.val" :label="opt.val">{{ opt.name }}</el-radio>
          </template>
        </div>
        <div>
          <template v-for="(opt, idx) in item.options">
            <div
              :key="'radio-tips' + idx"
              class="tips"
              v-if="opt.tips"
              v-show="item.val === opt.val"
            >
              {{ opt.tips }}
            </div>
          </template>
        </div>
      </template>

      <template v-if="item.type === 'datetime'">
        <el-date-picker
          type="datetime"
          v-model="item.val"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期"
        ></el-date-picker>
      </template>

      <upload
        v-if="item.type === 'upload'"
        :id="index"
        :label="item.label"
        :item="item"
        v-on:uploadSuccess="uploadSuccess"
      >
      </upload>

      <template v-if="item.type == 'desc'">
        <span class="form-item-desc" v-html="item.val"></span>
      </template>

      <div v-if="item.tips" class="tips">{{ item.tips }}</div>
    </el-form-item>
  </div>
</template>

<script>
import upload from '@/common/upload.vue';
export default {
  props: {
    item: {
      type: Object,
    },
    index: {
      type: Number,
    },
  },
  components: {
    upload,
  },
  methods: {
    setFont(item, attr) {
      if (attr === 'font-weight') {
        this.$set(item.val, 0, item.val[0] === '600' ? '400' : '600');
      }
      if (attr === 'text-decoration') {
        this.$set(item.val, 1, item.val[1] === 'underline' ? 'none' : 'underline');
      }
      if (attr === 'font-style') {
        this.$set(item.val, 2, item.val[2] === 'italic' ? 'inherit' : 'italic');
      }
    },
    setAlign(item, align) {
      this.$set(item.val, 3, align);
    },
    inputBlur(rule, item) {
      const reg = new RegExp(rule.regex);
      if (!item.val.match(reg)) {
        this.$alert(rule.tips, '提示');
        item.val = '';
        return false;
      }
    },
    uploadSuccess(item) {
      console.log('uploadSuccess', item);
    },
  },
};
</script>

<style lang="scss" scoped>
.tips {
  font-size: 12px;
  color: #9b9a9a;
}
span.form-item-desc {
  font-size: 12px;
  color: #666;
  line-height: 1.2;
}
.input-array {
  ::v-deep {
    .el-input {
      display: inline-block;
      width: 80%;
      margin-right: 10px;
    }
  }
}
.el-icon {
  cursor: pointer;

  &.el-icon-circle-plus {
    color: #4e75ff;
  }
  &.el-icon-remove {
    color: red;
  }
}
</style>
