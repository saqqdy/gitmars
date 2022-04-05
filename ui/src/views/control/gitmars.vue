<template>
    <div v-if="data.ready" class="page">
        <h1>
            Gitmars工作流
            <p>
                <v3-button type="primary" @click="createBranch">
                    创建分支
                </v3-button>
                <!-- <v3-button type="danger" @click="saveStash">删除分支</v3-button> -->
                <v3-button type="default" @click="back"> 返回 </v3-button>
            </p>
        </h1>
        <div class="cont">
            <div class="nav">
                <dl v-if="branchList.bugfix.length" class="bugfix">
                    <dt>bug分支</dt>
                    <dd
                        v-for="branch in branchList.bugfix"
                        :key="branch"
                        :class="{ active: branch === data.current }"
                    >
                        <span class="name">{{ branch }}</span>
                        <v3-button
                            type="primary"
                            size="mini"
                            v-if="branch !== data.current"
                            plain
                            @click="checkout(branch)"
                        >
                            进入
                        </v3-button>
                    </dd>
                </dl>
                <dl v-if="branchList.feature.length" class="feature">
                    <dt>feature分支</dt>
                    <dd
                        v-for="branch in branchList.feature"
                        :key="branch"
                        :class="{ active: branch === data.current }"
                    >
                        <span class="name">{{ branch }}</span>
                        <v3-button
                            type="primary"
                            v-if="branch !== data.current"
                            size="mini"
                            plain
                            @click="checkout(branch)"
                        >
                            进入
                        </v3-button>
                    </dd>
                </dl>
                <dl v-if="branchList.others.length" class="others">
                    <dt>其他分支</dt>
                    <dd
                        v-for="branch in branchList.others"
                        :key="branch"
                        :class="{ active: branch === data.current }"
                    >
                        <span class="name">{{ branch }}</span>
                        <v3-button
                            type="primary"
                            v-if="branch !== data.current"
                            size="mini"
                            plain
                            @click="checkout(branch)"
                        >
                            进入
                        </v3-button>
                    </dd>
                </dl>
            </div>
            <div class="main">
                <h3>
                    <span>
                        <span class="iconfont icon-layout" />
                        当前分支：{{ data.current }}
                    </span>
                    <p>{{ data.project.path }}</p>
                </h3>
                <div class="cmd">
                    <div class="section">
                        <h4>工作流</h4>
                        <v3-collapse
                            v-model="data.activeNames"
                            :accordion="true"
                            @change="handleChange"
                        >
                            <v3-collapse-item name="1">
                                <template #title>
                                    <MapCommand
                                        :value="commandValue['combine']"
                                        :current="data.current"
                                        @exec="exec"
                                    ></MapCommand>
                                </template>
                                <Command
                                    v-model="commandValue['combine']"
                                ></Command>
                            </v3-collapse-item>
                            <v3-collapse-item name="2">
                                <template #title>
                                    <MapCommand
                                        :value="commandValue['update']"
                                        :current="data.current"
                                        @exec="exec"
                                    />
                                </template>
                                <Command
                                    v-model="commandValue['update']"
                                ></Command>
                            </v3-collapse-item>
                            <v3-collapse-item name="3">
                                <template #title>
                                    <MapCommand
                                        :value="commandValue['build']"
                                        :current="data.current"
                                        @exec="exec"
                                    ></MapCommand>
                                </template>
                                <Command
                                    v-model="commandValue['build']"
                                ></Command>
                            </v3-collapse-item>
                            <v3-collapse-item name="4">
                                <template #title>
                                    <MapCommand
                                        :value="commandValue['continue']"
                                        :current="data.current"
                                        @exec="exec"
                                    />
                                </template>
                                <Command v-model="commandValue['continue']" />
                            </v3-collapse-item>
                            <v3-collapse-item name="5">
                                <template #title>
                                    <MapCommand
                                        :value="commandValue['end']"
                                        :current="data.current"
                                        @exec="exec"
                                    ></MapCommand>
                                </template>
                                <Command
                                    v-model="commandValue['end']"
                                ></Command>
                            </v3-collapse-item>
                            <v3-collapse-item name="6">
                                <template #title>
                                    <MapCommand
                                        :value="commandValue['branch']"
                                        :current="data.current"
                                        @exec="exec"
                                    />
                                </template>
                                <Command v-model="commandValue['branch']" />
                            </v3-collapse-item>
                            <v3-collapse-item name="7">
                                <template #title>
                                    <MapCommand
                                        :value="commandValue['undo']"
                                        :current="data.current"
                                        @exec="exec"
                                    ></MapCommand>
                                </template>
                                <Command v-model="commandValue['undo']" />
                            </v3-collapse-item>
                            <v3-collapse-item name="8">
                                <template #title>
                                    <MapCommand
                                        :value="commandValue['redo']"
                                        :current="data.current"
                                        @exec="exec"
                                    />
                                </template>
                                <Command v-model="commandValue['redo']" />
                            </v3-collapse-item>
                            <v3-collapse-item name="9">
                                <template #title>
                                    <MapCommand
                                        :value="
                                            commandValue['admin']['publish']
                                        "
                                        :current="data.current"
                                        execName="gitm admin"
                                        @exec="exec"
                                    ></MapCommand>
                                </template>
                                <Command
                                    v-model="commandValue['admin']['publish']"
                                ></Command>
                            </v3-collapse-item>
                        </v3-collapse>
                    </div>
                    <div class="section">
                        <h4>实用工具</h4>
                        <v3-collapse
                            v-model="data.activeNames"
                            :accordion="true"
                            @change="handleChange"
                        >
                            <v3-collapse-item name="11">
                                <template #title>
                                    <MapCommand
                                        :value="commandValue['save']"
                                        :current="data.current"
                                        @exec="exec"
                                    ></MapCommand>
                                </template>
                                <Command
                                    v-model="commandValue['save']"
                                ></Command>
                            </v3-collapse-item>
                            <v3-collapse-item name="12">
                                <template #title>
                                    <MapCommand
                                        :value="commandValue['get']"
                                        :current="data.current"
                                        @exec="exec"
                                    ></MapCommand>
                                </template>
                                <Command v-model="commandValue['get']" />
                            </v3-collapse-item>
                            <v3-collapse-item name="13">
                                <template #title>
                                    <MapCommand
                                        :value="commandValue['copy']"
                                        :current="data.current"
                                        @exec="exec"
                                    />
                                </template>
                                <Command v-model="commandValue['copy']" />
                            </v3-collapse-item>
                            <v3-collapse-item name="14">
                                <template #title>
                                    <MapCommand
                                        :value="commandValue['revert']"
                                        :current="data.current"
                                        @exec="exec"
                                    />
                                </template>
                                <Command v-model="commandValue['revert']" />
                            </v3-collapse-item>
                            <v3-collapse-item name="15">
                                <template #title>
                                    <MapCommand
                                        :value="commandValue['cleanbranch']"
                                        :current="data.current"
                                        @exec="exec"
                                    ></MapCommand>
                                </template>
                                <Command
                                    v-model="commandValue['cleanbranch']"
                                ></Command>
                            </v3-collapse-item>
                            <v3-collapse-item name="16">
                                <template #title>
                                    <MapCommand
                                        :value="commandValue['link']"
                                        :current="data.current"
                                        @exec="exec"
                                    />
                                </template>
                                <Command v-model="commandValue['link']" />
                            </v3-collapse-item>
                            <v3-collapse-item name="17">
                                <template #title>
                                    <MapCommand
                                        :value="commandValue['unlink']"
                                        :current="data.current"
                                        @exec="exec"
                                    ></MapCommand>
                                </template>
                                <Command
                                    v-model="commandValue['unlink']"
                                ></Command>
                            </v3-collapse-item>
                            <v3-collapse-item name="18">
                                <template #title>
                                    <MapCommand
                                        :value="commandValue['clean']"
                                        :current="data.current"
                                        @exec="exec"
                                    />
                                </template>
                                <Command
                                    v-model="commandValue['clean']"
                                ></Command>
                            </v3-collapse-item>
                            <v3-collapse-item name="19">
                                <template #title>
                                    <MapCommand
                                        :value="commandValue['log']"
                                        :current="data.current"
                                        @exec="exec"
                                    ></MapCommand>
                                </template>
                                <Command v-model="commandValue['log']" />
                            </v3-collapse-item>
                        </v3-collapse>
                    </div>
                </div>
                <Xterm
                    ref="xterm"
                    class="xterm"
                    v-if="data.project"
                    key="gitmars-xterm"
                    :id="terminalID"
                    :path="data.project.path"
                ></Xterm>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {
    computed,
    defineComponent,
    inject,
    onErrorCaptured,
    onMounted,
    reactive
} from 'vue'
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router'
import Command from './comp/command.vue'
import MapCommand from './comp/map-command.vue'
import commandSets from './gitmSets'
import boxAddBranchVue from './comp/box-add-branch.vue'
import Xterm from '@/components/xterm'
import { SocketInjectionKey, TerminalInjectionKey } from '@/symbols/injection'
import useCurrentInstance from '@/hooks/use-current-instance'

import type { CommandSetsType } from '@/types/command'
import type { BranchListType } from '@/types/branch'
import type { ProjectType } from '@/types/project'
import type { TerminalType } from '@/types/terminal'

interface DataType {
    project: ProjectType
    terminal: TerminalType
    activeNames: string
    branches: string[]
    current: string
    ready: boolean
    error: Error | Object
}

export default defineComponent({
    name: 'ControlGitmars',
    components: { Xterm, Command, MapCommand },
    async setup() {
        // data
        const { getTerminal /*, fitAddon */ } = inject(TerminalInjectionKey, {})
        const { socket, socketGitmars } = inject(SocketInjectionKey, {})
        const {
            globalProperties: { $axios, $box }
        } = useCurrentInstance()
        const router = useRouter()
        const route = useRoute()
        const width = window.innerWidth
        const height = window.innerHeight
        const data: DataType = reactive({
            project: { id: '', name: '', path: '' },
            terminal: { name: '' },
            activeNames: '',
            branches: [], // 分支列表
            current: '',
            ready: false,
            error: {}
        })
        const terminalID = computed(() => 'gitmars-' + data.project.id)
        const commandValue: {
            [prop: string]: CommandSetsType
        } = reactive(commandSets)

        // 计算属性
        const branchList = computed((): BranchListType => {
            const o = {
                bugfix: [],
                feature: [],
                others: []
            } as BranchListType
            data.branches.forEach((branch: string): void => {
                if (branch.includes('bugfix/')) {
                    o.bugfix.push(branch)
                } else if (branch.includes('feature/')) {
                    o.feature.push(branch)
                } else {
                    o.others.push(branch)
                }
            })
            return o
        })
        // 事件
        onMounted(() => {
            socketGitmars.emit('create', {
                name: data.project.id,
                cwd: data.project.path
            })
            socketGitmars.on(data.project.id + '-branch', (res: any) => {
                if (data) data.branches = res
            })
            socketGitmars.on(data.project.id + '-current', (res: string) => {
                if (data) data.current = res
            })
        })
        onBeforeRouteLeave(() => {
            // socketGitmars.off(data.project.id + '-branch')
            // socketGitmars.off(data.project.id + '-current')
            socketGitmars.emit('remove', data.project.id)
        })
        onErrorCaptured(err => {
            data.error = err
            return true
        })
        // 获取分支列表
        const getProject = async () => {
            return (
                await $axios({
                    url: '/common/project/list',
                    data: {
                        id: route.query.id
                    }
                })
            ).data
        }
        // 获取分支列表
        const getBranches = async () => {
            return (
                await $axios({
                    url: '/cmd/branch/list',
                    data: {}
                })
            ).data
        }
        // 获取当前分支
        const getCurrentBranch = async () => {
            return (
                await $axios({
                    url: '/cmd/branch/current',
                    data: {}
                })
            ).data
        }
        // 执行指令
        const exec = (cmd: string): void => {
            if (!data.terminal) return
            socket.emit(data.terminal.name + '-input', `${cmd}\r`)
        }
        data.project = await getProject()

        // 进入执行目录
        await $axios({
            url: '/cmd/cd',
            data: {
                dir: data.project.path
            }
        })

        data.branches = await getBranches()
        data.current = await getCurrentBranch()
        data.terminal =
            getTerminal &&
            getTerminal(
                terminalID.value,
                data.project.path,
                parseInt(String((width - 60 - 300 - 32) / 7.05)),
                parseInt(String((height - 64 - 32 - 34 - 400) / (16 * 1.1)))
            )
        data.ready = true
        const handleItemClick = () => {
            console.log('handleItemClick', 666)
        }
        const handleChange = () => {
            console.log('handleChange', 444)
        }
        // 创建分支
        const createBranch = () => {
            $box(boxAddBranchVue, {
                width: '640px',
                height: '240px',
                title: '创建分支',
                options: {},
                onOk: async (instance: any) => {
                    const { type, name } =
                        await instance.component.proxy.submit()
                    exec(`gitm start ${type} ${name}`)
                    return true
                }
            })
        }
        // const saveStash = () => {}
        // 返回项目列表
        const back = () => {
            router.push('/project/list')
        }
        // checkout分支
        const checkout = async (branch: string) => {
            exec(`git checkout ${branch}`)
            data.project = await getProject()
        }

        return {
            data,
            terminalID,
            exec,
            commandValue,
            route,
            branchList,
            handleItemClick,
            handleChange,
            createBranch,
            // saveStash,
            back,
            checkout
        }
    }
})
</script>

<style lang="less" scoped>
.page {
    display: flex;
    flex-direction: column;
    justify-content: stretch;
    align-items: stretch;
    ::v-deep(.v3-collapse) {
        border-top-color: #6a8bad;
    }
    ::v-deep(.v3-collapse-item__content) {
        color: #fff;
    }
    ::v-deep(.v3-collapse-item__header),
    ::v-deep(.v3-collapse-item__wrap) {
        border-bottom-color: #6a8bad;
        background: none;
        color: #fff;
    }
    h1 {
        height: 32px;
        padding: 16px;
        line-height: 32px;
        font-size: 28px;
        font-weight: 300;
        background: #344a5f;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .cont {
        flex: 1;
        display: flex;
        overflow: hidden;
        justify-content: stretch;
        align-items: stretch;
        .nav {
            width: 300px;
            overflow-y: auto;
            background: #2c3e50;
            height: 100%;
            dl {
                margin-bottom: 10px;
            }
            dt {
                padding: 0 16px;
                height: 20px;
                line-height: 20px;
                font-size: 12px;
                color: #6a8bad;
            }
            dd {
                height: 44px;
                line-height: 44px;
                padding: 0 16px;
                font-size: 14px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .name {
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                ::v-deep(.v3-button) {
                    min-width: 64px;
                }
                &:hover {
                    color: #fff;
                    background: rgba(66, 185, 131, 0.05);
                }
                &.active {
                    color: #42b983;
                    background: rgba(66, 185, 131, 0.08) !important;
                }
            }
        }
        .main {
            flex: 1;
            padding: 16px;
            background: #304457;
            display: flex;
            flex-direction: column;
            justify-content: stretch;
            align-items: stretch;
            height: 100%;
            h3 {
                font-size: 18px;
                line-height: 30px;
                margin-bottom: 16px;
                font-weight: normal;
                display: flex;
                justify-content: space-between;
                align-items: center;
                p {
                    font-size: 12px;
                    background: #2c3e50;
                    line-height: 18px;
                    padding: 8px;
                    border-radius: 3px;
                }
            }
            .cmd {
                flex: 1;
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                grid-template-rows: minmax(0px, auto) auto minmax(0px, auto);
                grid-template-areas: 'a' 'b';
                grid-auto-flow: row dense;
                justify-items: stretch;
                align-items: stretch;
                gap: 20px;
            }
            .xterm {
                height: calc(100% - 582px);
                min-height: 320px;
            }
        }
    }
}
</style>
