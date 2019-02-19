<template>
  <div class="dashboard-container">

    <el-row :gutter="24">
      <el-col :span="24">
        <div class="grid-content bg-purple">
          <el-card class="box-card">

            <div slot="header" class="clearfix">
              <el-form>
                <el-form-item>
                  <el-input v-model="f_name" placeholder="请输入服务名称进行过滤" style="width: 30%"></el-input>
                  <el-select placeholder="请选择测试" v-model="f_test" clearable>
                    <el-option v-for="(item,index) in p_tester" :key="index+''" :label="item.label"
                               :value="item.value"></el-option>
                  </el-select>
                  <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
                <el-form-item>
                  <template>
                    <section>
                      <!--列表-->
                      <el-table :data="filterProjectlist"
                                highlight-current-row
                                v-loading="listLoading"
                                height="73vh"
                                @selection-change="selsChange"
                                style="width: 100%;">
                        <!--<el-table-column width="50" label="序号" prop="e_id"></el-table-column>-->
                        <el-table-column width="240" label="服务名称" prop="p_name" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="branch" label="GIT分支" width="260"
                                         show-overflow-tooltip></el-table-column>
                        <el-table-column prop="md5" label="MD5" width="300" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="modify_content" label="修改内容" width="150"
                                         show-overflow-tooltip></el-table-column>
                        <el-table-column prop="modify_tester" label="测试" width="100"
                                         show-overflow-tooltip></el-table-column>
                        <el-table-column label="状态" width="100">
                          <template slot-scope="scope">
                            <el-select v-model="scope.row.status" size="medium" @change="checkRequest(scope.row)">
                              <el-option v-for="(item,index) in p_status" :key="index+''" :label="item.label"
                                         :value="item.value"></el-option>
                            </el-select>
                          </template>
                        </el-table-column>
                        <el-table-column prop="modify_date" label="处理时间" width="180" sortable
                                         show-overflow-tooltip></el-table-column>
                        <el-table-column label="操作" style="min-width: 260px;">
                          <template slot-scope="scope">
                            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
                            <el-button type="danger" size="small" @click="handleDel(scope.row)">删除</el-button>
                            <el-button size="small" type="info" plain @click="handleCopy(scope.row)">点击复制</el-button>
                          </template>
                        </el-table-column>
                      </el-table>

                      <el-col :span="12" :offset="6" class="toolbar" style="margin-top: 10px">
                        <div class="block">
                          <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentpage"
                            :page-sizes="sizes"
                            :page-size="pagesize"
                            :pager-count="7"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total">
                          </el-pagination>
                        </div>
                      </el-col>

                      <!--编辑界面-->
                      <el-dialog :title="k_name" :visible="addFormVisible" :close-on-click-modal="false"
                                 :before-close="resetForm">

                        <el-dialog width="50%" title="新增" :visible.sync="innerVisible" append-to-body
                                   :before-close="resetprojectForm" :close-on-click-modal="false">
                          <el-form :model="projectForm" :rules="projectFormRules" ref="projectForm">
                            <el-form-item label="服务名称：" prop="p_name">
                              <el-input v-model="projectForm.p_name" placeholder="请输入服务名称"></el-input>
                            </el-form-item>
                          </el-form>
                          <div slot="footer" class="dialog-footer">
                            <el-button @click.native="resetprojectForm">取消</el-button>
                            <el-button type="primary" @click.native="addProjectSubmit">提交</el-button>
                          </div>
                        </el-dialog>


                        <el-form :model="projectExtendForm" label-width="100px" :rules="projectExtendFormRules"
                                 ref="projectExtendForm">
                          <el-form-item label="服务名称:" prop="p_name">
                            <el-select v-model="projectExtendForm.p_name" filterable placeholder="请选择服务名称">
                              <el-option v-for="item in s_names" :key="item.value" :label="item.label"
                                         :value="item.value">
                              </el-option>
                            </el-select>
                            <el-button type="primary" @click="openProject">添加</el-button>

                          </el-form-item>
                          <el-form-item label="GIT分支:" prop="branch">
                            <el-input v-model.trim="projectExtendForm.branch" auto-complete="off"
                                      placeholder="请输入GIT分支"></el-input>
                          </el-form-item>
                          <el-form-item label="MD5值:" prop="md5">
                            <el-input v-model.trim="projectExtendForm.md5" auto-complete="off"
                                      placeholder="请输入MD5值"></el-input>
                          </el-form-item>
                          <el-form-item label="修改内容:" prop="modify_content">
                            <el-input type="textarea" v-model="projectExtendForm.modify_content" :rows="2"
                                      placeholder="请输入修改内容"></el-input>
                          </el-form-item>
                          <el-form-item label="测试:" prop="modify_tester">
                            <el-select v-model="projectExtendForm.modify_tester" placeholder="请选择测试">
                              <el-option v-for="(item,index) in p_tester" :key="index+''" :label="item.label"
                                         :value="item.value"></el-option>
                            </el-select>
                          </el-form-item>

                          <el-form-item label="状态:">
                            <el-select v-model="projectExtendForm.status" placeholder="请选择状态">
                              <el-option v-for="(item,index) in p_status" :key="index+''" :label="item.label"
                                         :value="item.value"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                          <el-button @click.native="resetForm">取消</el-button>
                          <el-button type="primary" @click.native="addSubmit">提交</el-button>
                        </div>
                      </el-dialog>
                    </section>
                  </template>
                </el-form-item>
              </el-form>
            </div>

          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>

  export default {
    data() {
      const validProjectName = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入项目名称'))
        } else if (value.length < 2) {
          callback(new Error('请输入长度在2到30个字符的项目名称'))
        } else if (value.length > 30) {
          callback(new Error('请输入长度在2到30个字符的项目名称'))
        } else {
          callback()
        }
      }
      return {
        f_name: '',
        f_test: '',
        k_name: '新增',
        project: [],
        total: 0,
        sizes: [15, 20, 30, 40],
        pagesize: 15,
        pageCount: 1,
        page: 1,
        currentpage: 1,
        listLoading: false,
        sels: [],//列表选中列
        innerVisible: false,
        editFormVisible: false,//编辑界面是否显示
        editLoading: false,
        options: [{label: "启用", value: 1}, {label: "禁用", value: -1}],
        editFormRules: {
          project_name: [
            {required: true, message: '请输入项目名称', trigger: 'blur'},
            {min: 2, max: 30, message: '请输入长度在2到30个字符的项目名称', trigger: 'blur'}
          ]
        },
        projectForm: {
          p_name: ''
        },
        projectFormRules: {
          p_name: {required: true, message: '请输入服务名称', trigger: 'blur'},
        },
        deal_type: 'add',
        p_status: [
          {value: '灰度', label: '灰度'},
          {value: '正式', label: '正式'},
        ],
        p_tester: [],
        s_names: [],
        p_status_val: '',
        addFormVisible: false,//新增界面是否显示
        projectExtendFormRules: {
          p_name: {required: true, message: '请选择服务名称', trigger: 'blur'},
          branch: {required: true, message: '请输入GIT分支', trigger: 'blur'},
          modify_content: {required: true, message: '请输入修改内容', trigger: 'blur'},
          modify_tester: {required: true, message: '请选择测试', trigger: 'blur'},
          status: {required: true, message: '请选择状态', trigger: 'blur'}
        },
        //新增界面数据
        projectExtendForm: {
          e_id: '',
          p_name: '',
          branch: '',
          md5: '',
          modify_content: '',
          modify_tester: '',
          status: '灰度'
        }
      }
    },
    methods: {
      changeTester(tester) {
        console.log(tester)
        this.f_test = tester
      },
      resetprojectForm() {
        this.innerVisible = false
        this.$refs.projectForm.resetFields()
        this.projectForm.p_name = ''
      },
      addProjectSubmit() {
        this.$refs.projectForm.validate(valid => {
          if (valid) {
            this.$axios.post('/project/add', this.projectForm.p_name)
              .then(res => {
                if (res.data.status === 'SUCCESS') {
                  this.innerVisible = false
                  this.getProjectList()
                  this.projectExtendForm.p_name = this.projectForm.p_name
                } else {
                  this.$message.error(res.data.msg)
                }
              })
              .catch(error => {
                console.log(error)
              })
          }
        })
      },
      openProject() {
        this.innerVisible = true
      },
      // 获取项目列表
      getProjectExtendList(pageSize, pageNo) {
        if (pageNo > this.pageCount) {
          pageNo = this.pageCount;
        }
        this.listLoading = true;
        this.$axios.post('/project/extend/list', {
          pageSize: pageSize,
          pageNo: pageNo
        }).then(response => {
          if (response.data.status === 'SUCCESS') {
            this.project = response.data.data;
            this.total = response.data.total
            this.pageCount = response.data.pageCount
            this.pageNo = response.data.pageNo
            this.pageSize = response.data.pageSize
            this.listLoading = false;
          } else {
            this.listLoading = false;
            this.$message.error({
              message: '获取项目列表失败',
              center: false
            })
          }

        }).catch(error => {
          this.listLoading = false;
          this.$message.error({
            message: '获取项目列表异常',
            center: false
          })
        })

      },
      copyPre(row) {
        return row.p_name + '\n'
          + '----------------麻烦更到线上' + '\n'
          + row.md5 + '\n'
      },
      handleCopy(row) {
        this.$copyText(this.copyPre(row))
          .then(function (e) {
            console.log(e)
          })
      },
      //删除
      handleDel: function (row) {
        // console.log(index, row)
        this.$confirm('确认删除该记录吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.post('/project/extend/del', row.e_id).then(response => {
            if (response.data.status === 'SUCCESS') {
              this.getProjectExtendList(15, 1)
            } else {
              this.$message({
                type: 'success',
                message: '删除失败!'
              });
            }

          }).catch(error => {
            this.$message.error({
              message: '删除异常',
              center: false
            })
          })

        }).catch(error => {
          console.log(error);
        })

      },
      handleSizeChange(val) {
        this.pagesize = val;
        this.getProjectExtendList(this.pagesize, 1);
      },
      handleCurrentChange(val) {
        this.currentpage = val;
        this.getProjectExtendList(this.pagesize, this.currentpage)

      },
      //显示编辑界面
      handleEdit: function (row) {
        this.$axios.post('/project/extend/info', row.e_id)
          .then(res => {
            if (res.data.status === 'SUCCESS') {
              this.deal_type = 'edit'
              this.k_name = '编辑'
              this.projectExtendForm = res.data.data
              this.getProjectList()
              this.getTesterList()
              this.$nextTick(() => {
                this.addFormVisible = true;
              })

            } else {
              this.$message.error(response.data.msg)
            }
          })
          .catch(error => {
            console.log(error)
          })
      },
      //显示新增界面
      handleAdd: function () {
        this.getTesterList()
        this.getProjectList()
        this.k_name = '新增'
        this.deal_type = 'add'
        this.$nextTick(() => {
          this.addFormVisible = true;
        })
        // this.addFormVisible = true;

      },
      getTesterList() {
        this.$axios.get('/tester/list')
          .then(response => {
            this.p_tester = response.data
          })
          .catch(error => {
          })
      },
      getTesterList() {
        this.$axios.get('/tester/list')
          .then(response => {
            if (response.data.status === 'SUCCESS') {
              this.p_tester = response.data.data
            } else {
              console.log(response.data.msg)
            }
          })
          .catch(error => {
          })
      },
      getProjectList() {
        this.$axios.get('/project/list')
          .then(response => {
            if (response.data.status === 'SUCCESS') {
              this.s_names = response.data.data
            } else {
              console.log(response.data.msg)
            }
          })
          .catch(error => {
          })
      },
      checkRequest(row) {
        this.$axios.post('/project/extend/edit', {
          'e_id': row.e_id,
          'status': row.status
        }).then(response => {
          if (response.data.status !== 'SUCCESS') {
            this.$message.error(response.data.msg)
          } else {
            console.log(response.data)
          }

        }).catch(error => {
          console.log(error)
        })
      },
      resetForm() {
        // this.$refs['projectExtendForm'].resetFields()

        this.projectExtendForm.e_id = ''
        this.projectExtendForm.p_name = ''
        this.projectExtendForm.branch = ''
        this.projectExtendForm.md5 = ''
        this.projectExtendForm.modify_content = ''
        this.projectExtendForm.modify_tester = ''
        this.projectExtendForm.status = '灰度'
        this.addFormVisible = false
      },
      //新增
      addSubmit: function () {
        this.$refs.projectExtendForm.validate(valid => {
          if (valid) {
            let url = '/project/extend/add'
            if (this.deal_type === 'edit') {
              url = '/project/extend/edit'
            }
            this.$axios.post(url, {
              'e_id': this.projectExtendForm.e_id,
              'p_name': this.projectExtendForm.p_name,
              'branch': this.projectExtendForm.branch,
              'md5': this.projectExtendForm.md5,
              'modify_content': this.projectExtendForm.modify_content,
              'modify_tester': this.projectExtendForm.modify_tester,
              'status': this.projectExtendForm.status
            }).then(response => {
              if (response.data.status === 'SUCCESS') {
                this.addFormVisible = false
                this.$refs.projectExtendForm.resetFields()
                this.getProjectExtendList(15, 1)
              } else {
                this.$message.error(response.data.msg)
              }

            }).catch(error => {
              console.log(error)
            })

          }
        })

      },
      selsChange: function (sels) {
        this.sels = sels;
      }
    },
    computed: {
      filterProjectlist() {
        return this.project.filter(
          item =>
            !this.f_name ||
            item.p_name.toLowerCase().includes(this.f_name.toLowerCase())
        )
          .filter(
            item =>
              !this.f_test ||
              item.modify_tester.toLowerCase().includes(this.f_test.toLowerCase())
          );
      }
    },
    mounted() {
      this.getProjectExtendList(15, 1);
      this.getTesterList();
    }
  }

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard {
    &-container {
      margin: 15px 20px 15px 20px;
    }
  }

  .el-form-item {
    margin-bottom: 20px;
  }

  .box-card {
    width: 100%;
    height: 90vh;

    /deep/ .el-card__body {
      padding: 10px;
      height: 80vh;
    }
  }
</style>
