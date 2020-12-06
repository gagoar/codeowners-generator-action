import { ActionMapInput } from '.';
import { generateCommand } from 'codeowners-generator';
import simpleGit, { SimpleGit } from 'simple-git';
const git: SimpleGit = simpleGit();

import { Status, Conclusion } from './util/constants';

type ActionOutput = {
  title: string;
  summary: string;
};

const actionsOutputMap: Record<Conclusion, ActionOutput> = {
  ['success']: {
    title: 'CODEOWNERS Correct!',
    summary: 'This check ensures the root CODEOWNERS file was updated to reflect any nested CODEOWNERS files.',
  },
  ['failure']: {
    title: 'Missing CODEOWNERS Changes',
    summary:
      'Looks like the root CODEOWNERS file has not been updated to reflect nested CODEOWNERS changes. Please run `codeowners-generator generate` and commit to fix.',
  },
};

export const handleCodeowners: ActionMapInput = async (client, { owner, repo, checkrunId }): Promise<void> => {
  console.log('Checking codeowners...');
  // Check if CODEOWNERS file is correct by running codeowners-generator and ensuring no changes
  await generateCommand({ parent: {} });

  console.log('Called codeowners - check if any change');

  const result = await git.status();

  const conclusion: Conclusion = result.isClean() ? 'success' : 'failure';

  const status: Status = 'completed';

  const payload = {
    owner: owner,
    repo: repo,
    check_run_id: checkrunId,
    status: status,
    output: actionsOutputMap[conclusion],
    conclusion: conclusion,
  };

  console.log('Payload: ' + JSON.stringify(payload));

  await client.checks.update(payload);
};
