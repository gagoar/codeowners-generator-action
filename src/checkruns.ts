import { ActionMapInput } from '.';

enum CheckrunStatus {
  inProgress = 'in_progress',
  completed = 'completed',
}

enum CheckrunConclusion {
  success = 'success',
  failure = 'failure',
}

type CheckrunOutput = {
  title: string;
  summary: string;
};

export type CheckrunCreate = {
  name: string;
  owner: string;
  repo: string;
  head_sha: string;
  status: CheckrunStatus;
  output: CheckrunOutput;
};

export type CheckrunComplete = {
  owner: string;
  repo: string;
  check_run_id: number;
  status: CheckrunStatus;
  output: CheckrunOutput;
  conclusion: CheckrunConclusion;
};

export const createCheckrun: ActionMapInput = async (client, { owner, repo, sha }): Promise<void> => {
  console.log('Creating check run...');

  const payload = {
    name: 'CODEOWNERS Check',
    owner: owner,
    repo: repo,
    head_sha: sha,
    status: CheckrunStatus.inProgress,
    output: {
      title: 'Checking CODEOWNERS',
      summary: 'This check ensures the root CODEOWNERS file was updated to reflect any nested CODEOWNERS files.',
    },
  };

  console.log('Payload: ' + JSON.stringify(payload));

  await client.checks.create(payload);
};
