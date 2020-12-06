import { getInput } from '@actions/core';
import { Octokit } from '@octokit/rest';

import { createCheckrun } from './checkruns';
import { handleCodeowners } from './codeowners';

import { Event } from './util/constants';
import { env } from './environment';
import { loadJSONFile } from './util/loadJSONFile';

enum RuleAction {
  START = 'START',
  CHECK_CODEOWNERS = 'CHECK_CODEOWNERS',
}

export type ActionInput = {
  owner: string;
  repo: string;
  sha: string;
  checkrunId: number;
};

export type ActionMapInput = (client: InstanceType<typeof Octokit>, options: ActionInput) => Promise<unknown>;

enum Prop {
  githubToken = 'githubToken',
  action = 'action',
}

const getParam = (prop: Prop) => {
  return getInput(prop); //, {} as Partial<Record<keyof typeof Prop, string>>;
};

const actionsMap: Record<RuleAction, ActionMapInput> = {
  [RuleAction.START]: createCheckrun,
  [RuleAction.CHECK_CODEOWNERS]: handleCodeowners,
};

export const main: () => Promise<void> = async () => {
  const event = loadJSONFile<Event>(env.GITHUB_EVENT_PATH);

  const {
    pull_request: {
      head: { sha: sha },
    },
    repository: {
      name: repo,
      owner: { login: owner },
    },
    check_run: { id: checkrunId },
  } = event;

  const actionName: string = getParam(Prop.action);
  const ruleAction: RuleAction = (<any>RuleAction)[actionName];

  const action: ActionMapInput = (<any>actionsMap)[ruleAction];

  const GITHUB_TOKEN = getInput(Prop.githubToken);

  const client = new Octokit({
    auth: GITHUB_TOKEN,
  });

  const options: ActionInput = {
    owner,
    repo,
    sha,
    checkrunId,
  };

  action(client, options);
};
